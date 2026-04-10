import { Field, Float, ID, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Product {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field(() => String, { nullable: true })
  description: string | null;

  @Field(() => Float)
  price: number;

  @Field(() => Int)
  stock: number;

  @Field(() => String, { nullable: true })
  imageUrl: string | null;

  @Field(() => Float, { nullable: true })
  rating: number | null;

  categoryId: string;
}
