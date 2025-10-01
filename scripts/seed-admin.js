const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // Create admin user
  const hashedPassword = await bcrypt.hash('deep@mishra1234', 12);
  
  const admin = await prisma.adminUser.upsert({
    where: { email: 'admin-deep@rammed' },
    update: {},
    create: {
      email: 'admin-deep@rammed',
      password: hashedPassword,
      name: 'Deep Mishra',
      role: 'admin',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create some sample categories
  const categories = [
    {
      name: 'Endoscopy Equipment',
      slug: 'endoscopy-equipment',
      description: 'Advanced endoscopic systems and accessories'
    },
    {
      name: 'Surgical Instruments',
      slug: 'surgical-instruments',
      description: 'Precision surgical tools and instruments'
    },
    {
      name: 'Medical Imaging',
      slug: 'medical-imaging',
      description: 'State-of-the-art imaging solutions'
    }
  ];

  for (const categoryData of categories) {
    try {
      await prisma.category.upsert({
        where: { slug: categoryData.slug },
        update: {},
        create: categoryData,
      });
    } catch (error) {
      console.log(`Category ${categoryData.name} already exists, skipping...`);
    }
  }

  console.log('Sample categories created');

  // Create some sample customers and orders for testing
  const customers = [
    {
      email: 'john.doe@hospital.com',
      firstName: 'John',
      lastName: 'Doe',
      phone: '+1-555-0123',
      company: 'General Hospital'
    },
    {
      email: 'jane.smith@clinic.com',
      firstName: 'Jane',
      lastName: 'Smith',
      phone: '+1-555-0456',
      company: 'Medical Clinic'
    }
  ];

  for (const customerData of customers) {
    const customer = await prisma.customer.upsert({
      where: { email: customerData.email },
      update: {},
      create: customerData,
    });

    // Create sample orders
    await prisma.order.upsert({
      where: { orderNumber: `ORD-${customer.id.slice(-4)}` },
      update: {},
      create: {
        orderNumber: `ORD-${customer.id.slice(-4)}`,
        customerId: customer.id,
        status: 'confirmed',
        totalAmount: 15000.00,
        currency: 'USD',
        shippingAddress: JSON.stringify({
          street: '123 Hospital St',
          city: 'Medical City',
          state: 'CA',
          zip: '90210'
        }),
      },
    });
  }

  console.log('Sample customers and orders created');

  // Create some sample products
  const sampleProducts = [
    {
      name: 'RAMMED Pro Endoscope HD',
      sku: 'RM-ENDO-001',
      price: 125000.00,
      currency: 'INR',
      stock: 5,
      shortDesc: 'Professional HD endoscope with advanced imaging capabilities',
      description: 'State-of-the-art HD endoscope designed for precision diagnostics and minimally invasive procedures. Features high-resolution imaging, flexible shaft, and ergonomic design for enhanced user comfort.',
      categoryId: null, // Will be set after finding category
      imageUrls: JSON.stringify(['/images/products/endoscope-placeholder.jpg']),
      isActive: true
    },
    {
      name: 'RAMMED Digital X-Ray System',
      sku: 'RM-XRAY-002',
      price: 850000.00,
      currency: 'INR',
      stock: 2,
      shortDesc: 'Advanced digital X-ray system with high resolution imaging',
      description: 'Cutting-edge digital radiography system offering superior image quality, reduced radiation exposure, and instant image processing. Ideal for hospitals and diagnostic centers.',
      categoryId: null,
      imageUrls: JSON.stringify(['/images/products/xray-placeholder.jpg']),
      isActive: true
    },
    {
      name: 'RAMMED Laparoscopic Camera System',
      sku: 'RM-LAPRO-003',
      price: 285000.00,
      currency: 'INR',
      stock: 8,
      shortDesc: '4K laparoscopic camera for minimally invasive surgery',
      description: 'Professional-grade 4K laparoscopic camera system with exceptional clarity and color reproduction. Designed for precision in minimally invasive surgical procedures.',
      categoryId: null,
      imageUrls: JSON.stringify(['/images/products/laparoscope-placeholder.jpg']),
      isActive: true
    },
    {
      name: 'RAMMED Surgical Forceps Set',
      sku: 'RM-FRCPS-004',
      price: 15000.00,
      currency: 'INR',
      stock: 25,
      shortDesc: 'Premium surgical forceps set with titanium coating',
      description: 'Complete set of surgical forceps made from high-grade stainless steel with titanium coating for enhanced durability and precision. Includes various sizes for different procedures.',
      categoryId: null,
      imageUrls: JSON.stringify(['/images/products/forceps-placeholder.jpg']),
      isActive: true
    }
  ];

  // Find categories and create products
  const endoscopyCategory = await prisma.category.findFirst({
    where: { slug: 'endoscopy-equipment' }
  });
  const surgicalCategory = await prisma.category.findFirst({
    where: { slug: 'surgical-instruments' }
  });
  const imagingCategory = await prisma.category.findFirst({
    where: { slug: 'medical-imaging' }
  });

  // Assign categories
  sampleProducts[0].categoryId = endoscopyCategory?.id;
  sampleProducts[1].categoryId = imagingCategory?.id;
  sampleProducts[2].categoryId = endoscopyCategory?.id;
  sampleProducts[3].categoryId = surgicalCategory?.id;

  for (const productData of sampleProducts) {
    if (productData.categoryId) {
      try {
        await prisma.product.upsert({
          where: { sku: productData.sku },
          update: {},
          create: {
            ...productData,
            slug: productData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now()
          }
        });
      } catch (error) {
        console.log(`Product ${productData.name} already exists, skipping...`);
      }
    }
  }

  console.log('Sample products created');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });