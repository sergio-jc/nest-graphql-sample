import {
  Args,
  Float,
  ID,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';
import { Category } from '../categories/entities/category.entity';
import { Review } from '../reviews/entities/review.entity';
import { ReviewsService } from '../reviews/reviews.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(
    private readonly productsService: ProductsService,
    private readonly reviewsService: ReviewsService,
    private readonly prisma: PrismaService,
  ) {}

  @Query(() => [Product], { name: 'products' })
  products(): Promise<Product[]> {
    return this.productsService.findAll();
  }

  @Query(() => Product, { name: 'product', nullable: true })
  product(@Args('id', { type: () => ID }) id: string): Promise<Product | null> {
    return this.productsService.findOne(id);
  }

  @ResolveField(() => Category)
  async category(@Parent() product: Product): Promise<Category> {
    const category = await this.prisma.category.findUnique({
      where: { id: product.categoryId },
    });
    if (!category) {
      throw new NotFoundException(
        `Categoria no encontrada para el producto "${product.id}"`,
      );
    }
    return category;
  }

  @ResolveField(() => [Review])
  reviews(@Parent() product: Product): Promise<Review[]> {
    return this.reviewsService.findByProductId(product.id);
  }

  @ResolveField(() => Float, { nullable: true })
  rating(@Parent() product: Product): Promise<number | null> {
    return this.reviewsService.averageRatingByProductId(product.id);
  }
}
