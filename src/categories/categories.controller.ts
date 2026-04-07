import { Controller, Get, Param } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Category } from './entities/category.entity';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  findAll(): Category[] {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Category {
    const category = this.categoriesService.findOne(id);
    if (!category) {
      throw new Error(`Category with id "${id}" not found`);
    }
    return category;
  }

  @Get('name/:name')
  findByName(@Param('name') name: string): Category {
    const category = this.categoriesService.findByName(name);
    if (!category) {
      throw new Error(`Category with name "${name}" not found`);
    }
    return category;
  }
}
