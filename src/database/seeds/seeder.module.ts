import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductsSeeder } from '../seeds/products.seeder';
import { ProductSchema } from 'src/modules/products/products.model';
import { DatabaseModule } from '../database.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    MongooseModule.forFeature([{ name: 'Product', schema: ProductSchema }]),
  ],
  providers: [ProductsSeeder],
  exports: [ProductsSeeder],
})
export class SeederModule {}
