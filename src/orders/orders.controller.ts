import { Controller, Get, Param } from '@nestjs/common';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  findAll(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string): Promise<Order[]> {
    return this.ordersService.findByUserId(userId);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Order> {
    return this.ordersService.findOneOrFail(id);
  }
}
