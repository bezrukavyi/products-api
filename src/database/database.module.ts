import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: `mongodb://${configService.get('MONGO_USERNAME')}:${configService.get('MONGO_PASSWORD')}@${configService.get('MONGO_HOST')}/${configService.get('MONGO_DATABASE')}`,
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}
