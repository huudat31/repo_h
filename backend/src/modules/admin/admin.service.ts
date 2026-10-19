import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderStatus, PaymentStatus } from '@prisma/client';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const yearStart = new Date();
    yearStart.setMonth(0, 1);
    yearStart.setHours(0, 0, 0, 0);

    const [
      allOrders,
      todayOrders,
      monthOrders,
      yearOrders,
      totalProducts,
      lowStockProducts,
      totalUsers,
      recentOrders,
      topItems,
    ] = await Promise.all([
      // Tất cả đơn hàng hoàn tất/xác nhận
      this.prisma.order.findMany({
        where: {
          status: { not: OrderStatus.CANCELLED },
        },
        select: { finalAmount: true, status: true },
      }),
      // Đơn hàng hôm nay
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: todayStart },
          status: { not: OrderStatus.CANCELLED },
        },
        select: { finalAmount: true },
      }),
      // Đơn hàng tháng này
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: monthStart },
          status: { not: OrderStatus.CANCELLED },
        },
        select: { finalAmount: true },
      }),
      // Đơn hàng năm nay
      this.prisma.order.findMany({
        where: {
          createdAt: { gte: yearStart },
          status: { not: OrderStatus.CANCELLED },
        },
        select: { finalAmount: true },
      }),
      // Tổng số sản phẩm
      this.prisma.product.count(),
      // Sản phẩm sắp hết hàng (tồn kho <= 5)
      this.prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, sku: true, stock: true, price: true },
        take: 10,
      }),
      // Tổng số khách hàng
      this.prisma.user.count({ where: { role: 'CUSTOMER' } }),
      // Đơn hàng gần đây
      this.prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { fullName: true, email: true } },
          items: true,
        },
      }),
      // Top sản phẩm được mua nhiều
      this.prisma.orderItem.groupBy({
        by: ['productId', 'productName'],
        _sum: { quantity: true },
        orderBy: { _sum: { quantity: 'desc' } },
        take: 5,
      }),
    ]);

    const totalRevenue = allOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    const todayRevenue = todayOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    const monthRevenue = monthOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    const yearRevenue = yearOrders.reduce((sum, o) => sum + o.finalAmount, 0);
    const pendingOrdersCount = allOrders.filter((o) => o.status === OrderStatus.PENDING).length;

    return {
      revenue: {
        total: totalRevenue,
        today: todayRevenue,
        thisMonth: monthRevenue,
        thisYear: yearRevenue,
      },
      counts: {
        totalOrders: allOrders.length,
        pendingOrders: pendingOrdersCount,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        totalUsers,
      },
      lowStockProducts,
      recentOrders,
      topSelling: topItems.map((item) => ({
        productId: item.productId,
        productName: item.productName,
        totalSold: item._sum.quantity || 0,
      })),
    };
  }

  // Quản lý Banners
  async getBanners() {
    return this.prisma.banner.findMany({
      orderBy: [{ position: 'asc' }, { createdAt: 'desc' }],
    });
  }

  async createBanner(data: { title: string; imageUrl: string; linkUrl?: string; position?: number }) {
    return this.prisma.banner.create({
      data: {
        title: data.title.trim(),
        imageUrl: data.imageUrl.trim(),
        linkUrl: data.linkUrl?.trim() || null,
        position: Number(data.position) || 0,
        isActive: true,
      },
    });
  }

  async updateBanner(id: string, data: any) {
    return this.prisma.banner.update({
      where: { id },
      data,
    });
  }

  async deleteBanner(id: string) {
    await this.prisma.banner.delete({ where: { id } });
    return { success: true };
  }
}
