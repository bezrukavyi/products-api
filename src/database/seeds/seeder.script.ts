import { NestFactory } from '@nestjs/core';
import { SeederModule } from './seeder.module';
import { ProductsSeeder } from './products.seeder';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeederModule);

  const productsSeeder = app.get(ProductsSeeder);

  try {
    await productsSeeder.seed();
    console.log('Seeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await app.close();
  }
}

bootstrap();
