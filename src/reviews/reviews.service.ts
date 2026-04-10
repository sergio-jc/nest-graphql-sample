import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Review } from './entities/review.entity';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany();
    return reviews.map((r) => ({
      ...r,
      user: undefined as never,
      product: undefined as never,
    }));
  }

  async findOne(id: string): Promise<Review | null> {
    const review = await this.prisma.review.findUnique({ where: { id } });
    return review
      ? { ...review, user: undefined as never, product: undefined as never }
      : null;
  }

  async findOneOrFail(id: string): Promise<Review> {
    const review = await this.findOne(id);
    if (!review) {
      throw new NotFoundException(`Reseña con id "${id}" no encontrada`);
    }
    return review;
  }

  async findByUserId(userId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({ where: { userId } });
    return reviews.map((r) => ({
      ...r,
      user: undefined as never,
      product: undefined as never,
    }));
  }

  async findByProductId(productId: string): Promise<Review[]> {
    const reviews = await this.prisma.review.findMany({ where: { productId } });
    return reviews.map((r) => ({
      ...r,
      user: undefined as never,
      product: undefined as never,
    }));
  }

  async averageRatingByProductId(productId: string): Promise<number | null> {
    const result = await this.prisma.review.aggregate({
      where: { productId },
      _avg: { rating: true },
    });
    return result._avg.rating;
  }
}
