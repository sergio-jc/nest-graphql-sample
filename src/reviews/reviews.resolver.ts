import {
  Args,
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
import { Review } from './entities/review.entity';
import { ReviewsService } from './reviews.service';

@Resolver(() => Review)
export class ReviewsResolver {
  constructor(
    private readonly reviewsService: ReviewsService,
    private readonly usersService: UsersService,
    private readonly productsService: ProductsService,
  ) {}

  @Query(() => [Review], { name: 'reviews' })
  reviews(): Promise<Review[]> {
    return this.reviewsService.findAll();
  }

  @Query(() => Review, { name: 'review', nullable: true })
  review(@Args('id', { type: () => ID }) id: string): Promise<Review | null> {
    return this.reviewsService.findOne(id);
  }

  @ResolveField(() => User)
  async user(@Parent() review: Review): Promise<User> {
    return this.usersService.findOneOrFail(review.userId);
  }

  @ResolveField(() => Product)
  async product(@Parent() review: Review): Promise<Product> {
    return this.productsService.findOneOrFail(review.productId);
  }
}
