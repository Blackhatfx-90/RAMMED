import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Helper function to verify admin token
function verifyAdmin(request: NextRequest): JwtPayload | null {
  const token = request.cookies.get('admin-token')?.value;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET || 'your-jwt-secret') as JwtPayload;
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search');
    const categoryId = searchParams.get('categoryId');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.ProductWhereInput = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { sku: { contains: search } },
        { description: { contains: search } }
      ];
    }
    if (categoryId && categoryId !== 'all') {
      where.categoryId = categoryId;
    }

    const [products, totalCount, categories] = await Promise.all([
      prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: {
            select: {
              name: true,
              slug: true
            }
          }
        }
      }),
      prisma.product.count({ where }),
      prisma.category.findMany({
        select: {
          id: true,
          name: true,
          slug: true
        },
        orderBy: { name: 'asc' }
      })
    ]);

    return NextResponse.json({
      products,
      categories,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Products fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const {
      name,
      description,
      shortDesc,
      sku,
      price,
      currency = 'INR',
      stock = 0,
      imageUrls,
      specifications,
      documents,
      categoryId,
      isActive = true
    } = await request.json();

    // Validate required fields
    if (!name || !sku || !price || !categoryId) {
      return NextResponse.json({ 
        error: 'Name, SKU, price, and category are required' 
      }, { status: 400 });
    }

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Create product
    const product = await prisma.product.create({
      data: {
        name,
        slug: `${slug}-${Date.now()}`, // Ensure uniqueness
        description,
        shortDesc,
        sku,
        price: parseFloat(price),
        currency,
        stock: parseInt(stock) || 0,
        imageUrls: JSON.stringify(imageUrls || []),
        specifications: specifications ? JSON.stringify(specifications) : null,
        documents: documents ? JSON.stringify(documents) : null,
        categoryId,
        isActive
      },
      include: {
        category: {
          select: {
            name: true,
            slug: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      product
    });
  } catch (error: unknown) {
    console.error('Product creation error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ 
        error: 'Product with this SKU already exists' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json({ error: 'Product ID is required' }, { status: 400 });
    }

    // Check if product exists
    const existingProduct = await prisma.product.findUnique({
      where: { id: productId }
    });

    if (!existingProduct) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Delete the product
    await prisma.product.delete({
      where: { id: productId }
    });

    return NextResponse.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error: unknown) {
    console.error('Product deletion error:', error);
    
    if (error instanceof Error && 'code' in error && error.code === 'P2003') {
      return NextResponse.json({ 
        error: 'Cannot delete product - it has associated orders' 
      }, { status: 400 });
    }
    
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
