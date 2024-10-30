import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongoServer: MongoMemoryServer;

export const rootMongooseTestModule = () =>
  MongooseModule.forRootAsync({
    useFactory: async () => ({
      uri: mongoServer.getUri(),
    }),
  });

export const startMongoMemoryServer = async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
};

export const cleanMemoryServer = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
  }
};

export const closeInMongodConnection = async () => {
  if (mongoose.connection.readyState !== 0) {
    console.log('Closing mongoose connection');
    await cleanMemoryServer();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    console.log('Stopping mongo server');
    await mongoServer.stop();
  }
};
