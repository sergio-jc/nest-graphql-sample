import { Injectable, NotFoundException } from '@nestjs/common';
import { Product } from './entities/product.entity';

const MOCK_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Auriculares Bluetooth',
    description: 'Cancelación de ruido, 30h de batería',
    price: 79.99,
    stock: 42,
    category: 'audio',
  },
  {
    id: '2',
    name: 'Teclado mecánico',
    description: 'Switches táctiles, layout ISO',
    price: 119.5,
    stock: 15,
    category: 'periféricos',
  },
  {
    id: '3',
    name: 'Monitor 27" 4K',
    description: 'IPS, 60Hz, HDR400',
    price: 349.0,
    stock: 8,
    category: 'monitores',
  },
  {
    id: '4',
    name: 'Hub USB-C',
    description: '7 en 1: HDMI, USB-A, SD',
    price: 45.0,
    stock: 100,
    category: 'accesorios',
  },
];

@Injectable()
export class ProductsService {
  findAll(): Product[] {
    return [...MOCK_PRODUCTS];
  }

  findOne(id: string): Product | undefined {
    return MOCK_PRODUCTS.find((p) => p.id === id);
  }

  findOneOrFail(id: string): Product {
    const product = this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Producto con id "${id}" no encontrado`);
    }
    return product;
  }
}
