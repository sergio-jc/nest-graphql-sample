import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule } from '@nestjs/throttler';
import depthLimit from 'graphql-depth-limit';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlThrottlerGuard } from './gql-throttler.guard';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
        blockDuration: 10 * 60_000,
      },
    ]),
    PrismaModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile:
        process.env.NODE_ENV === 'production'
          ? true
          : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: false,
      graphiql: true,
      validationRules: [depthLimit(6)],
      context: ({ req, res }: { req: unknown; res: unknown }) => ({ req, res }),
      formatError: (error) => ({
        message: error.message,
        code: error.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
      }),
    }),
    ProductsModule,
    CategoriesModule,
    UsersModule,
    ReviewsModule,
    OrdersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: GqlThrottlerGuard,
    },
  ],
})
export class AppModule {}
