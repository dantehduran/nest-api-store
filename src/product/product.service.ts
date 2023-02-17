import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, EditProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  getProducts() {
    return this.prisma.product.findMany();
  }

  getProduct(id: number) {
    return this.prisma.product.findUnique({ where: { id } });
  }

  async createProduct(dto: CreateProductDto) {
    const product = await this.prisma.product.create({
      data: { ...dto, price: new Decimal(dto.price) },
    });
    return product;
  }

  editProduct(id: number, dto: EditProductDto) {
    return this.prisma.product.update({
      where: { id },
      data: dto,
    });
  }
  deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
