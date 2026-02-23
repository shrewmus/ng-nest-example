import 'reflect-metadata';
import * as path from 'node:path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { Poll } from './src/polls/poll.entity';

dotenv.config({ path: path.resolve(__dirname, '../local-docker/.env') });
dotenv.config();

export default new DataSource({
  type: 'mariadb',
  host: process.env.DB_HOST ?? 'localhost',
  port: Number(process.env.DB_PORT ?? 3306),
  username: process.env.DB_USER ?? 'quickpoll',
  password: process.env.DB_PASSWORD ?? 'quickpoll123',
  database: process.env.DB_NAME ?? 'quickpoll',
  entities: [Poll],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  migrationsRun: false,
  logging: false,
});
