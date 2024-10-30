import {
  startMongoMemoryServer,
  cleanMemoryServer,
} from '../utils/mongoose-test-utils';

beforeAll(async () => {
  await startMongoMemoryServer();
});

afterEach(async () => {
  await cleanMemoryServer();
});
