import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map((u) => ({ ...u, reviews: [], orders: [] }));
  }

  async findOne(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    return user ? { ...user, reviews: [], orders: [] } : null;
  }

  async findOneOrFail(id: string): Promise<User> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`Usuario con id "${id}" no encontrado`);
    }
    return user;
  }
}
