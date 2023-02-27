import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { User } from '@prisma/client';
import { AdminGuard } from '../common/guards';
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
  getAllUsers(
    @Query('currentPage') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.userService.getAllUsers(+currentPage, +limit);
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

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  @UseGuards(new AdminGuard())
  deleteUser(@Param('id') id: number) {
    return this.userService.deleteUser(+id);
  }
}
