import { NestFactory } from '@nestjs/core';
import { AppModule } from 'app.module';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const repl = require('repl').start({});

  repl.on('exit', async () => {
    await app.close();
  });
}

bootstrap();
