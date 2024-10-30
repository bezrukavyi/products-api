import { closeInMongodConnection } from './mongoose-test-utils';

export default async function globalTeardown() {
  console.log('\n🔥 Global Teardown');
  await closeInMongodConnection();
  process.exit(0);
}
