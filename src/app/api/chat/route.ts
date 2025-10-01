import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // First, try to search for relevant products in the database
    const searchTerms = message.toLowerCase().split(' ').filter((term: string) => term.length > 2);
    
    let products: Array<{
      id: string;
      name: string;
      price: number;
      shortDesc: string | null;
      category: string;
      imageUrls: string[];
    }> = [];
    if (searchTerms.length > 0) {
      const dbProducts = await prisma.product.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchTerms.join(' ')
              }
            },
            {
              description: {
                contains: searchTerms.join(' ')
              }
            },
            {
              shortDesc: {
                contains: searchTerms.join(' ')
              }
            },
            ...searchTerms.map((term: string) => ({
              name: { contains: term }
            })),
            ...searchTerms.map((term: string) => ({
              description: { contains: term }
            }))
          ],
          isActive: true
        },
        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        },
        take: 5
      });

      // Map the database results to our expected type
      products = dbProducts.map(p => ({
        id: p.id,
        name: p.name,
        price: p.price,
        shortDesc: p.shortDesc,
        category: p.category.name,
        imageUrls: p.imageUrls ? JSON.parse(p.imageUrls) : []
      }));
    }

    // Try OpenAI API if available
    let aiResponse = null;
    if (process.env.OPENAI_API_KEY) {
      try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-3.5-turbo',
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant for RAMMED Medical Equipment company. 
                You help customers with inquiries about medical equipment, surgical instruments, endoscopy equipment, and medical imaging solutions. 
                Be professional, helpful, and knowledgeable about medical equipment.
                If you don't know specific product details, recommend contacting the sales team via WhatsApp.
                Keep responses concise and helpful.`
              },
              {
                role: 'user',
                content: message
              }
            ],
            max_tokens: 200,
            temperature: 0.7,
          }),
        });

        if (openaiResponse.ok) {
          const openaiData = await openaiResponse.json();
          aiResponse = openaiData.choices[0]?.message?.content;
        }
      } catch (error) {
        console.log('OpenAI API not available, using fallback response');
      }
    }

    // Generate response based on products found or AI response
    let response = '';
    
    if (aiResponse) {
      response = aiResponse;
    } else {
      // Fallback responses based on message content
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('price') || lowerMessage.includes('cost')) {
        response = 'For pricing information on our medical equipment, please contact our sales team via WhatsApp. We offer competitive prices and can provide detailed quotations based on your specific requirements.';
      } else if (lowerMessage.includes('endoscop')) {
        response = 'We offer a comprehensive range of endoscopy equipment including HD endoscopes, laparoscopic cameras, and endoscopic accessories. Our products are designed for precision and reliability in minimally invasive procedures.';
      } else if (lowerMessage.includes('surgical') || lowerMessage.includes('instrument')) {
        response = 'RAMMED provides high-quality surgical instruments including forceps, scissors, retractors, and specialized surgical tools. All our instruments meet international quality standards and are designed for durability and precision.';
      } else if (lowerMessage.includes('imaging') || lowerMessage.includes('x-ray') || lowerMessage.includes('ultrasound')) {
        response = 'Our medical imaging solutions include digital X-ray systems, ultrasound machines, and advanced imaging equipment. These systems provide high-resolution images for accurate diagnosis and treatment planning.';
      } else if (lowerMessage.includes('support') || lowerMessage.includes('help') || lowerMessage.includes('service')) {
        response = 'We provide comprehensive technical support, training, and maintenance services for all our products. Our support team is available to help you with installation, training, and ongoing technical assistance.';
      } else {
        response = 'Hello! I\'m here to help you with information about RAMMED medical equipment. We specialize in surgical instruments, endoscopy equipment, and medical imaging solutions. How can I assist you today?';
      }
    }

    // Add product suggestions if found
    if (products.length > 0) {
      response += '\n\nHere are some relevant products from our catalog:\n';
      products.forEach((product, index) => {
        response += `\n${index + 1}. ${product.name} - ₹${product.price.toLocaleString()} (${product.category})`;
        if (product.shortDesc) {
          response += `\n   ${product.shortDesc}`;
        }
      });
      response += '\n\nWould you like more details about any of these products? Please contact our team via WhatsApp for personalized assistance.';
    }

    return NextResponse.json({
      response,
      products
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      response: 'I apologize, but I\'m experiencing some technical difficulties. Please contact our support team via WhatsApp for immediate assistance with your inquiry.',
      products: []
    });
  } finally {
    await prisma.$disconnect();
  }
}