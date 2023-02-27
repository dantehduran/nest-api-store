import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRecordDto } from './dto/create-record.dto';

@Injectable()
export class RecordService {
  constructor(private prisma: PrismaService) {}
  async create(dto: CreateRecordDto, userId: number) {
    const record = await this.prisma.record.create({
      data: {
        amount: dto.amount,
        type: dto.type,
        user: { connect: { id: userId } },
        product: { connect: { id: dto.productId } },
      },
    });
    const stock =
      dto.type === 'INCREMENT'
        ? { increment: dto.amount }
        : { decrement: dto.amount };
    await this.prisma.product.update({
      where: { id: dto.productId },
      data: {
        stock,
      },
    });
    return record;
  }

  async findAll(currentPage: number, limit: number) {
    const totalCount = await this.prisma.record.count();
    const data = await this.prisma.record.findMany({
      skip: (currentPage - 1) * limit,
      take: limit,
      orderBy: [
        {
          createdAt: 'desc',
        },
      ],
      include: {
        user: { select: { id: true, username: true } },
        product: { select: { id: true, name: true } },
      },
    });
    return { totalCount, rows: data };
  }

  async remove(id: number) {
    const record = await this.prisma.record.delete({ where: { id } });
    const stock =
      record.type === 'DECREMENT'
        ? { increment: record.amount }
        : { decrement: record.amount };
    await this.prisma.product.update({
      where: { id: record.productId },
      data: {
        stock,
      },
    });
    return record;
  }
}
