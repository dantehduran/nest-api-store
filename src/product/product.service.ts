import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, EditProductDto } from './dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}
  async getProducts(currentPage: number, limit: number = 10) {
    const totalCount = await this.prisma.product.count();
    const data = await this.prisma.product.findMany({
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      include: { categories: true },
    });
    return { totalCount, rows: data };
  }

  getProduct(id: number) {
    return this.prisma.product.findUnique({
      where: { id },
      include: { categories: true },
    });
  }

  createProduct(dto: CreateProductDto) {
    const categories =
      dto.categories === undefined
        ? undefined
        : {
            connect: dto.categories.map((category) => ({
              id: category,
            })),
          };
    const product = this.prisma.product.create({
      data: {
        ...dto,
        categories,
      },
    });
    return product;
  }

  async editProduct(id: number, dto: EditProductDto) {
    const categories =
      dto.categories === undefined
        ? undefined
        : {
            connect: dto.categories.map((category) => ({
              id: category,
            })),
          };
    await this.prisma.product.update({
      where: { id },
      data: {
        categories: { set: [] },
      },
    });
    return this.prisma.product.update({
      where: { id },
      data: { ...dto, categories },
    });
  }
  deleteProduct(id: number) {
    return this.prisma.product.delete({ where: { id } });
  }
}
