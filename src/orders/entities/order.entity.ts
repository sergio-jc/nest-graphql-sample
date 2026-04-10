import {
  Field,
  Float,
  GraphQLISODateTime,
  ID,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { OrderStatus } from '../../../generated/prisma/client';
import { User } from '../../users/entities/user.entity';
import { OrderItem } from './order-item.entity';

registerEnumType(OrderStatus, {
  name: 'OrderStatus',
});

@ObjectType()
export class Order {
  @Field(() => ID)
  id: string;

  userId: string;

  @Field(() => User)
  user: User;

  @Field(() => [OrderItem])
  items: OrderItem[];

  @Field(() => Float)
  total: number;

  @Field(() => OrderStatus)
  status: OrderStatus;

  @Field(() => GraphQLISODateTime)
  createdAt: Date;

  @Field(() => GraphQLISODateTime)
  updatedAt: Date;
}
