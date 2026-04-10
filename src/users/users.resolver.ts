import {
  Args,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Order } from '../orders/entities/order.entity';
import { OrdersService } from '../orders/orders.service';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
    private readonly ordersService: OrdersService,
  ) {}

  @Query(() => [User], { name: 'users' })
  users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User, { name: 'user', nullable: true })
  user(@Args('id', { type: () => ID }) id: string): Promise<User | null> {
    return this.usersService.findOne(id);
  }

  @ResolveField(() => [Review])
  reviews(@Parent() user: User): Promise<Review[]> {
    return this.reviewsService.findByUserId(user.id);
  }

  @ResolveField(() => [Order])
  orders(@Parent() user: User): Promise<Order[]> {
    return this.ordersService.findByUserId(user.id);
  }
}
