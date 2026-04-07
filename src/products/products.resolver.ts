import { Args, ID, Query, Resolver } from '@nestjs/graphql';
import { Product } from './entities/product.entity';
import { ProductsService } from './products.service';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private readonly productsService: ProductsService) {}

  @Query(() => [Product], { name: 'products' })
  products(): Product[] {
    return this.productsService.findAll();
  }

  @Query(() => Product, { name: 'product', nullable: true })
  product(@Args('id', { type: () => ID }) id: string): Product | null {
    return this.productsService.findOne(id) ?? null;
  }
}
