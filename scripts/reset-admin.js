const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  // First, let's check if the admin user exists
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: 'admin-deep@rammed' }
  });

  if (existingAdmin) {
    console.log('Found existing admin user:', existingAdmin.email);
    console.log('Admin name:', existingAdmin.name);
    console.log('Created at:', existingAdmin.createdAt);
  } else {
    console.log('No admin user found with email: admin-deep@rammed');
  }

  // Delete existing admin and create new one with correct credentials
  await prisma.adminUser.deleteMany({
    where: { email: 'admin-deep@rammed' }
  });

  console.log('Deleted existing admin user');

  // Create new admin user with correct credentials
  const hashedPassword = await bcrypt.hash('deep@mishra1234', 12);
  
  const admin = await prisma.adminUser.create({
    data: {
      email: 'admin-deep@rammed',
      password: hashedPassword,
      name: 'Deep Mishra',
      role: 'admin',
    },
  });

  console.log('✅ New admin user created successfully!');
  console.log('Email:', admin.email);
  console.log('Name:', admin.name);
  console.log('Role:', admin.role);
  
  // Test the password hash
  const isPasswordCorrect = await bcrypt.compare('deep@mishra1234', admin.password);
  console.log('✅ Password verification:', isPasswordCorrect ? 'PASSED' : 'FAILED');
  
  console.log('\n🔑 Login Credentials:');
  console.log('Email: admin-deep@rammed');
  console.log('Password: deep@mishra1234');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });