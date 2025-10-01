import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt, { JwtPayload } from 'jsonwebtoken';

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
    const period = searchParams.get('period') || '30'; // days

    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(period));

    // Get total sales
    const totalSalesResult = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: daysAgo
        },
        status: {
          not: 'cancelled'
        }
      },
      _sum: {
        totalAmount: true
      },
      _count: true
    });

    // Get sales by status
    const ordersByStatus = await prisma.order.groupBy({
      by: ['status'],
      where: {
        createdAt: {
          gte: daysAgo
        }
      },
      _count: true,
      _sum: {
        totalAmount: true
      }
    });

    // Get daily sales for chart
    const dailySales = await prisma.$queryRaw`
      SELECT 
        DATE(createdAt) as date,
        COUNT(*) as orders,
        SUM(totalAmount) as revenue
      FROM Order 
      WHERE createdAt >= ${daysAgo}
        AND status != 'cancelled'
      GROUP BY DATE(createdAt)
      ORDER BY date DESC
    `;

    // Get top selling products
    const topProducts = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: daysAgo
          },
          status: {
            not: 'cancelled'
          }
        }
      },
      _sum: {
        quantity: true,
        totalPrice: true
      },
      orderBy: {
        _sum: {
          totalPrice: 'desc'
        }
      },
      take: 10
    });

    // Get product details for top products
    const productIds = topProducts.map(p => p.productId);
    const products = await prisma.product.findMany({
      where: {
        id: {
          in: productIds
        }
      },
      select: {
        id: true,
        name: true,
        sku: true,
        price: true
      }
    });

    const topProductsWithDetails = topProducts.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        ...item,
        product
      };
    });

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: 10,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            firstName: true,
            lastName: true,
            email: true
          }
        },
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
                sku: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({
      summary: {
        totalRevenue: totalSalesResult._sum.totalAmount || 0,
        totalOrders: totalSalesResult._count || 0,
        averageOrderValue: totalSalesResult._count > 0 
          ? (totalSalesResult._sum.totalAmount || 0) / totalSalesResult._count 
          : 0
      },
      ordersByStatus,
      dailySales,
      topProducts: topProductsWithDetails,
      recentOrders
    });
  } catch (error) {
    console.error('Analytics error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}