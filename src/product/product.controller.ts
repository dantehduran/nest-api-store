import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateProductDto, EditProductDto } from './dto';
import { ProductService } from './product.service';

@UseGuards(AuthGuard('jwt'))
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}
  @Get()
  getProducts(
    @Query('currentPage') currentPage: number,
    @Query('limit') limit: number,
  ) {
    return this.productService.getProducts(+currentPage, +limit);
  }

  @Get(':id')
  getProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.getProduct(id);
  }

  @Post()
  createProduct(@Body() dto: CreateProductDto) {
    return this.productService.createProduct(dto);
  }

  @Patch(':id')
  editProduct(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: EditProductDto,
  ) {
    return this.productService.editProduct(id, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteProduct(@Param('id', ParseIntPipe) id: number) {
    return this.productService.deleteProduct(id);
  }
}
