import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 12);
  const adminUser = await prisma.adminUser.upsert({
    where: { email: 'admin@rammed.com' },
    update: {},
    create: {
      email: 'admin@rammed.com',
      password: hashedPassword,
      name: 'RAMMED Admin',
      role: 'admin',
    },
  });

  console.log('👤 Created admin user:', adminUser.email);

  // Create categories
  const endoscopyCategory = await prisma.category.upsert({
    where: { slug: 'endoscopy' },
    update: {},
    create: {
      name: 'Endoscopy Equipment',
      slug: 'endoscopy',
      description: 'Advanced endoscopic systems and accessories for minimally invasive procedures',
      imageUrl: '/images/categories/endoscopy.jpg',
    },
  });

  const surgicalCategory = await prisma.category.upsert({
    where: { slug: 'surgical-instruments' },
    update: {},
    create: {
      name: 'Surgical Instruments',
      slug: 'surgical-instruments',
      description: 'Precision surgical instruments for various medical procedures',
      imageUrl: '/images/categories/surgical-instruments.jpg',
    },
  });

  const imagingCategory = await prisma.category.upsert({
    where: { slug: 'medical-imaging' },
    update: {},
    create: {
      name: 'Medical Imaging',
      slug: 'medical-imaging',
      description: 'State-of-the-art imaging solutions for accurate diagnosis',
      imageUrl: '/images/categories/medical-imaging.jpg',
    },
  });

  console.log('📂 Created categories');

  // Create sample products
  const products = [
    {
      name: 'RAMMED Pro Endoscope HD',
      slug: 'rammed-pro-endoscope-hd',
      description: 'Professional-grade HD endoscope with advanced imaging capabilities. Features high-definition visualization, ergonomic design, and superior light transmission for precise medical procedures.',
      shortDesc: 'Professional HD endoscope with advanced imaging',
      sku: 'RAM-ENDO-001',
      price: 12500.00,
      stock: 15,
      categoryId: endoscopyCategory.id,
      imageUrls: JSON.stringify([
        '/images/products/endoscope-1.jpg',
        '/images/products/endoscope-2.jpg',
        '/images/products/endoscope-3.jpg'
      ]),
      specifications: JSON.stringify({
        'Resolution': '1920x1080 Full HD',
        'Field of View': '120 degrees',
        'Working Length': '600mm',
        'Diameter': '5.5mm',
        'Light Source': 'LED',
        'Sterilization': 'Autoclavable',
        'Warranty': '2 years'
      }),
      documents: JSON.stringify([
        '/documents/endoscope-manual.pdf',
        '/documents/endoscope-warranty.pdf'
      ])
    },
    {
      name: 'RAMMED Surgical Forceps Set',
      slug: 'rammed-surgical-forceps-set',
      description: 'Complete set of premium surgical forceps made from high-grade stainless steel. Includes various sizes and types for different surgical applications.',
      shortDesc: 'Premium surgical forceps set - various sizes',
      sku: 'RAM-FORC-002',
      price: 450.00,
      stock: 50,
      categoryId: surgicalCategory.id,
      imageUrls: JSON.stringify([
        '/images/products/forceps-1.jpg',
        '/images/products/forceps-2.jpg'
      ]),
      specifications: JSON.stringify({
        'Material': '316L Stainless Steel',
        'Pieces': '12 pieces',
        'Lengths': '125mm, 150mm, 200mm, 250mm',
        'Types': 'Straight, Curved, Serrated',
        'Sterilization': 'Autoclavable',
        'Finish': 'Mirror Polish',
        'Warranty': '1 year'
      }),
      documents: JSON.stringify([
        '/documents/forceps-catalog.pdf'
      ])
    },
    {
      name: 'RAMMED Digital X-Ray System',
      slug: 'rammed-digital-xray-system',
      description: 'Advanced digital X-ray system with high-resolution imaging and low radiation exposure. Perfect for diagnostic imaging in hospitals and clinics.',
      shortDesc: 'Advanced digital X-ray system with high resolution',
      sku: 'RAM-XRAY-003',
      price: 85000.00,
      stock: 3,
      categoryId: imagingCategory.id,
      imageUrls: JSON.stringify([
        '/images/products/xray-1.jpg',
        '/images/products/xray-2.jpg',
        '/images/products/xray-3.jpg',
        '/images/products/xray-4.jpg'
      ]),
      specifications: JSON.stringify({
        'Resolution': '4K Ultra HD',
        'Detector Size': '17" x 17"',
        'Power': '65 kW',
        'Radiation Dose': 'Low dose technology',
        'Image Processing': 'Real-time',
        'Storage': '500GB SSD',
        'Connectivity': 'DICOM compatible',
        'Warranty': '3 years'
      }),
      documents: JSON.stringify([
        '/documents/xray-manual.pdf',
        '/documents/xray-installation.pdf',
        '/documents/xray-certification.pdf'
      ])
    },
    {
      name: 'RAMMED Laparoscopic Camera System',
      slug: 'rammed-laparoscopic-camera',
      description: '4K laparoscopic camera system with exceptional image quality and advanced light management for minimally invasive surgery.',
      shortDesc: '4K laparoscopic camera for minimally invasive surgery',
      sku: 'RAM-LAPARO-004',
      price: 28500.00,
      stock: 8,
      categoryId: endoscopyCategory.id,
      imageUrls: JSON.stringify([
        '/images/products/laparoscope-1.jpg',
        '/images/products/laparoscope-2.jpg'
      ]),
      specifications: JSON.stringify({
        'Resolution': '4K UHD (3840x2160)',
        'Frame Rate': '60fps',
        'Light Source': 'Xenon',
        'Recording': '4K video recording',
        'Zoom': '1x-10x digital zoom',
        'Compatibility': 'Standard laparoscopes',
        'Warranty': '2 years'
      }),
      documents: JSON.stringify([
        '/documents/laparoscope-manual.pdf'
      ])
    },
    {
      name: 'RAMMED Ultrasound Scanner Pro',
      slug: 'rammed-ultrasound-scanner-pro',
      description: 'Portable ultrasound scanner with advanced imaging algorithms and multiple probe compatibility for comprehensive diagnostic capabilities.',
      shortDesc: 'Portable ultrasound scanner with advanced imaging',
      sku: 'RAM-ULTRA-005',
      price: 35000.00,
      stock: 6,
      categoryId: imagingCategory.id,
      imageUrls: JSON.stringify([
        '/images/products/ultrasound-1.jpg',
        '/images/products/ultrasound-2.jpg',
        '/images/products/ultrasound-3.jpg'
      ]),
      specifications: JSON.stringify({
        'Display': '15" HD touchscreen',
        'Probes': 'Linear, Curved, Phased Array',
        'Imaging Modes': '2D, 3D, 4D, Doppler',
        'Battery Life': '4+ hours',
        'Weight': '3.5 kg',
        'Storage': '1TB internal',
        'Connectivity': 'WiFi, USB, DICOM',
        'Warranty': '2 years'
      }),
      documents: JSON.stringify([
        '/documents/ultrasound-manual.pdf',
        '/documents/ultrasound-probes.pdf'
      ])
    }
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }

  console.log('🛍️ Created sample products');

  // Create a sample customer and order
  const customer = await prisma.customer.upsert({
    where: { email: 'john.doe@hospital.com' },
    update: {},
    create: {
      email: 'john.doe@hospital.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0123',
      company: 'Metropolitan Hospital',
    },
  });

  const order = await prisma.order.create({
    data: {
      orderNumber: 'ORD-2024-001',
      customerId: customer.id,
      status: 'confirmed',
      totalAmount: 13000.00,
      currency: 'USD',
      shippingAddress: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        company: 'Metropolitan Hospital',
        address1: '123 Medical Center Dr',
        address2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '+1-555-0123'
      }),
      billingAddress: JSON.stringify({
        firstName: 'John',
        lastName: 'Doe',
        company: 'Metropolitan Hospital',
        address1: '123 Medical Center Dr',
        address2: 'Suite 100',
        city: 'New York',
        state: 'NY',
        postalCode: '10001',
        country: 'US',
        phone: '+1-555-0123'
      }),
      orderItems: {
        create: [
          {
            productId: products[0].sku === 'RAM-ENDO-001' ? (await prisma.product.findUnique({ where: { sku: 'RAM-ENDO-001' } }))!.id : '',
            quantity: 1,
            unitPrice: 12500.00,
            totalPrice: 12500.00,
          },
          {
            productId: products[1].sku === 'RAM-FORC-002' ? (await prisma.product.findUnique({ where: { sku: 'RAM-FORC-002' } }))!.id : '',
            quantity: 1,
            unitPrice: 450.00,
            totalPrice: 450.00,
          }
        ]
      },
      payments: {
        create: {
          amount: 13000.00,
          currency: 'USD',
          status: 'succeeded',
          paymentMethod: 'card',
          stripePaymentId: 'pi_test_sample_payment',
        }
      }
    },
  });

  console.log('📦 Created sample order');

  console.log('✅ Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });