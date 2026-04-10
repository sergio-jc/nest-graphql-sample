import {
  Args,
  Float,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Product } from '../products/entities/product.entity';
import { ProductsService } from '../products/products.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { OrderItem } from './entities/order-item.entity';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Resolver(() => Order)
export class OrdersResolver {
  constructor(
    private readonly ordersService: OrdersService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @Query(() => [Order], { name: 'orders' })
  orders(): Promise<Order[]> {
    return this.ordersService.findAll();
  }

  @Query(() => Order, { name: 'order', nullable: true })
  order(@Args('id', { type: () => ID }) id: string): Promise<Order | null> {
    return this.ordersService.findOne(id);
  }

  @ResolveField(() => User)
  async user(@Parent() order: Order): Promise<User> {
    return this.usersService.findOneOrFail(order.userId);
  }

  @ResolveField(() => [OrderItem])
  items(@Parent() order: Order): Promise<OrderItem[]> {
    return this.ordersService.findItemsByOrderId(order.id);
  }

  @ResolveField(() => Float)
  total(@Parent() order: Order): Promise<number> {
    return this.ordersService.computeTotal(order.id);
  }
}

@Resolver(() => OrderItem)
export class OrderItemsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @ResolveField(() => Product)
  product(@Parent() item: OrderItem): Promise<Product> {
    return this.productsService.findOneOrFail(item.productId);
  }
}
