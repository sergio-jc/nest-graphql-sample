import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();
    return products.map((p) => ({ ...p, rating: null }));
  }

  async findOne(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product ? { ...product, rating: null } : null;
  }

  async findOneOrFail(id: string): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }
    return product;
  }

  async findByCategoryId(categoryId: string): Promise<Product[]> {
    const products = await this.prisma.product.findMany({
      where: { categoryId },
    });
    return products.map((p) => ({ ...p, rating: null }));
  }
}
