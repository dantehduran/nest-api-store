import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AdminGuard } from 'src/common/guards';
import { GetUser } from '../auth/decorator';
import { EditDto } from './dto';
import { CreateDto } from './dto/create-user.dto';
import { UserService } from './user.service';

@UseGuards(AuthGuard('jwt'))
@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}
  @Get('me')
  getMe(@GetUser() user: User) {
    return user;
  }

  @Get()
  @UseGuards(new AdminGuard())
  getAllUsers(@GetUser() user: User) {
    return this.userService.getAllUsers();
  }

  @Post()
  @UseGuards(new AdminGuard())
  createUser(@Body() dto: CreateDto) {
    return this.userService.craeteUser(dto);
  }

  @Patch(':id')
  @UseGuards(new AdminGuard())
  updateUser(@Body() dto: EditDto, @Param('id') id: number) {
    return this.userService.editUser(id, dto);
  }

  @Delete(':id')
  @UseGuards(new AdminGuard())
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(id);
  }
}
