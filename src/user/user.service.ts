import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EditDto } from './dto';
import { CreateDto } from './dto/create-user.dto';
import * as argon from 'argon2';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async craeteUser(dto: CreateDto) {
    const hash = await argon.hash(dto.password);
    const user = await this.prisma.user.create({
      data: {
        username: dto.username,
        fullName: dto.fullName,
        hash,
      },
    });
    delete user.hash;
    return user;
  }

  async editUser(id: number, dto: EditDto) {
    const user = await this.prisma.user.update({
      where: {
        id: Number(id),
      },
      data: {
        ...dto,
      },
    });
    delete user.hash;
    return user;
  }
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        username: true,
        fullName: true,
        createdAt: true,
      },
    });
    return users;
  }
  async deleteUser(userId: number) {
    const user = await this.prisma.user.delete({
      where: {
        id: Number(userId),
      },
    });
    return user;
  }
}
