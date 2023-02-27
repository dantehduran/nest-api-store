import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../common/guards';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UseGuards(new AdminGuard())
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  findAll(
    @Query('currentPage') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.categoryService.findAll(+currentPage, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.categoryService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(new AdminGuard())
  update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(new AdminGuard())
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.categoryService.remove(+id);
  }
}
