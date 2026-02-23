import { DataSourceOptions } from 'typeorm';
import { Poll } from '../polls/poll.entity';

export function buildTypeOrmOptions(): DataSourceOptions {
  return {
    type: 'mariadb',
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    username: process.env.DB_USER ?? 'quickpoll',
    password: process.env.DB_PASSWORD ?? 'quickpoll123',
    database: process.env.DB_NAME ?? 'quickpoll',
    entities: [Poll],
    migrations: ['dist/src/migrations/*.js'],
    synchronize: false,
    migrationsRun: false,
    logging: false,
  };
}
