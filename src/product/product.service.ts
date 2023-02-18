import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, EditProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  getProducts() {
    return this.prisma.product.findMany();
  }

  getProduct(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  async createProduct(dto: CreateProductDto) {
    const categories =
      dto.categories === undefined
        ? undefined
        : {
            connect: dto.categories.map((category) => ({
              id: category,
            })),
          };
    const product = await this.prisma.product.create({
      data: {
        ...dto,
        price: new Prisma.Decimal(dto.price),
        categories,
      },
    });
    console.log(product);
    return product;
  }

  editProduct(id: number, dto: EditProductDto) {
    const categories =
      dto.categories === undefined
        ? undefined
        : {
            connect: dto.categories.map((category) => ({
              id: category,
            })),
          };
    return this.prisma.product.update({
      where: { id },
      data: { ...dto, categories },
    });
  }
  deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
