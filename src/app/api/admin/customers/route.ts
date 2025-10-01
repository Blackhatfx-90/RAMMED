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

    const skip = (page - 1) * limit;

    // Build where clause
    const where: Prisma.CustomerWhereInput = {};
    if (search) {
      where.OR = [
        { email: { contains: search } },
        { firstName: { contains: search } },
        { lastName: { contains: search } },
        { company: { contains: search } }
      ];
    }

    const [customers, totalCount] = await Promise.all([
      prisma.customer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              totalAmount: true,
              status: true,
              createdAt: true
            },
            orderBy: { createdAt: 'desc' }
          }
        }
      }),
      prisma.customer.count({ where })
    ]);

    // Calculate customer stats
    const customersWithStats = customers.map(customer => {
      const totalSpent = customer.orders.reduce((sum, order) => 
        order.status !== 'cancelled' ? sum + order.totalAmount : sum, 0
      );
      const orderCount = customer.orders.filter(order => order.status !== 'cancelled').length;
      const lastOrderDate = customer.orders.length > 0 ? customer.orders[0].createdAt : null;

      return {
        ...customer,
        totalSpent,
        orderCount,
        lastOrderDate
      };
    });

    return NextResponse.json({
      customers: customersWithStats,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Customers fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}