import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { ProductsModule } from './modules/products/products.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      `mongodb://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@${process.env.MONGO_HOST}/${process.env.MONGO_DATABASE}`,
    ),
    ProductsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
