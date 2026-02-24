import { DataSourceOptions } from 'typeorm';
import { Poll } from '../polls/poll.entity';

export function buildTypeOrmOptions(): DataSourceOptions {
  const host = process.env.DB_HOST ?? process.env.MARIADB_HOST ?? '127.0.0.1';
  const port = Number(process.env.DB_PORT ?? process.env.MARIADB_PORT ?? 3306);
  const username = process.env.DB_USER ?? process.env.MARIADB_USER ?? 'quickpoll';
  const password =
    process.env.DB_PASSWORD ?? process.env.MARIADB_PASSWORD ?? 'quickpoll123';
  const database =
    process.env.DB_NAME ?? process.env.MARIADB_DATABASE ?? 'quickpoll';

  return {
    type: 'mariadb',
    connectorPackage: 'mysql2',
    host,
    port,
    username,
    password,
    database,
    entities: [Poll],
    migrations: ['dist/src/migrations/*.js'],
    synchronize: false,
    migrationsRun: false,
    logging: false,
  };
}
