import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}
  create(createCategoryDto: CreateCategoryDto) {
    return this.prisma.category.create({
      data: createCategoryDto,
    });
  }

  async findAll(currentPage?: number, limit?: number) {
    const totalCount = await this.prisma.category.count();
    const rows =
      currentPage && limit
        ? { take: limit, skip: (currentPage - 1) * limit }
        : null;
    const data = await this.prisma.category.findMany({
      ...rows,
    });
    return { totalCount, rows: data };
  }

  findOne(id: number) {
    return this.prisma.category.findUnique({
      where: { id },
      include: { products: true },
    });
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto,
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }
}
