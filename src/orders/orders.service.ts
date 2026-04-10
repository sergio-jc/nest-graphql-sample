import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Order[]> {
    const orders = await this.prisma.order.findMany();
    return orders.map((o) => ({
      ...o,
      user: undefined as never,
      items: [],
      total: 0,
    }));
  }

  async findOne(id: string): Promise<Order | null> {
    const order = await this.prisma.order.findUnique({ where: { id } });
    return order
      ? { ...order, user: undefined as never, items: [], total: 0 }
      : null;
  }

  async findOneOrFail(id: string): Promise<Order> {
    const order = await this.findOne(id);
    if (!order) {
      throw new NotFoundException(`Orden con id "${id}" no encontrada`);
    }
    return order;
  }

  async findByUserId(userId: string): Promise<Order[]> {
    const orders = await this.prisma.order.findMany({ where: { userId } });
    return orders.map((o) => ({
      ...o,
      user: undefined as never,
      items: [],
      total: 0,
    }));
  }

  async findItemsByOrderId(orderId: string): Promise<OrderItem[]> {
    const items = await this.prisma.orderItem.findMany({ where: { orderId } });
    return items.map((i) => ({ ...i, product: undefined as never }));
  }

  async computeTotal(orderId: string): Promise<number> {
    const items = await this.prisma.orderItem.findMany({
      where: { orderId },
      select: { quantity: true, unitPrice: true },
    });
    return items.reduce((sum, i) => sum + i.quantity * i.unitPrice, 0);
  }
}
