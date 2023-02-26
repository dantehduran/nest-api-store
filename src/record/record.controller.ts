import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RecordService } from './record.service';
import { CreateRecordDto } from './dto/create-record.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/auth/decorator';

@Controller('records')
@UseGuards(AuthGuard('jwt'))
export class RecordController {
  constructor(private readonly recordService: RecordService) {}

  @Post()
  create(
    @Body() createRecordDto: CreateRecordDto,
    @GetUser('id') userId: number,
  ) {
    return this.recordService.create(createRecordDto, +userId);
  }

  @Get()
  findAll() {
    return this.recordService.findAll();
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.recordService.remove(+id);
  }
}
