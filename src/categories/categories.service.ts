import { Injectable } from '@nestjs/common';
import { Category } from './entities/category.entity';

const MOCK_CATEGORIES: Category[] = [
  {
    id: '1',
    name: 'audio',
    description: 'Dispositivos de audio y sonido',
    productCount: 1,
  },
  {
    id: '2',
    name: 'periféricos',
    description: 'Teclados, ratones y accesorios',
    productCount: 1,
  },
  {
    id: '3',
    name: 'monitores',
    description: 'Pantallas y displays',
    productCount: 1,
  },
  {
    id: '4',
    name: 'accesorios',
    description: 'Cables, adaptadores y complementos',
    productCount: 1,
  },
];

@Injectable()
export class CategoriesService {
  findAll(): Category[] {
    return [...MOCK_CATEGORIES];
  }

  findOne(id: string): Category | undefined {
    return MOCK_CATEGORIES.find((c) => c.id === id);
  }

  findByName(name: string): Category | undefined {
    return MOCK_CATEGORIES.find(
      (c) => c.name.toLowerCase() === name.toLowerCase(),
    );
  }
}
