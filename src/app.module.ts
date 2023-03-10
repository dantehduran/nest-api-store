import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { CategoryModule } from './category/category.module';
import { RecordModule } from './record/record.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    ProductModule,
    PrismaModule,
    CategoryModule,
    RecordModule,
  ],
})
export class AppModule {}
