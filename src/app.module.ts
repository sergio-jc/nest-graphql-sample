import { Module } from '@nestjs/common';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import depthLimit from 'graphql-depth-limit';
import { join } from 'path';
import { validateEnv } from './config/env.validation';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataloaderModule } from './dataloader/dataloader.module';
import { DataloaderService } from './dataloader/dataloader.service';
import { GqlThrottlerGuard } from './gql-throttler.guard';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
import { UsersModule } from './users/users.module';
import { ReviewsModule } from './reviews/reviews.module';
import { OrdersModule } from './orders/orders.module';

@Module({
  imports: [
    // Validates all env vars at startup — app crashes with a clear message
    // if a required var is missing instead of failing silently at runtime.
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),
    ThrottlerModule.forRoot([
      {
        name: 'default',
        ttl: 60_000,
        limit: 60,
        blockDuration: 10 * 60_000,
      },
    ]),
    PrismaModule,
    HealthModule,
    DataloaderModule,
    // forRootAsync permite inyectar DataloaderService para crearlo por request.
    // `driver` va fuera de useFactory (requisito de la API de NestJS GraphQL).
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      imports: [DataloaderModule],
      inject: [DataloaderService],
      useFactory: (dataloaderService: DataloaderService) => ({
        autoSchemaFile:
          process.env.NODE_ENV === 'production'
            ? true
            : join(process.cwd(), 'src/schema.gql'),
        sortSchema: true,
        playground: false,
        graphiql: true,
        validationRules: [depthLimit(6)],
        formatError: (error) => ({
          message: error.message,
          code: error.extensions?.code ?? 'INTERNAL_SERVER_ERROR',
        }),
        // Se llama una vez por request. Crea loaders frescos con caché aislado
        // por request — nunca se comparte estado entre usuarios.
        context: ({ req, res }: { req: unknown; res: unknown }) => ({
          req,
          res,
          loaders: dataloaderService.createLoaders(),
        }),
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
