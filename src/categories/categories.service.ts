import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  findOne(id: string): Promise<Category | null> {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async findOneOrFail(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new NotFoundException(`Categoria con id "${id}" no encontrada`);
    }
    return category;
  }

  findByName(name: string): Promise<Category | null> {
    return this.prisma.category.findFirst({
      where: { name },
    });
  }

  async findByNameOrFail(name: string): Promise<Category> {
    const category = await this.findByName(name);
    if (!category) {
      throw new NotFoundException(
        `Categoria con nombre "${name}" no encontrada`,
      );
    }
    return category;
  }
}
