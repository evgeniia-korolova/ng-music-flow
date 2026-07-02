import { DataSource } from 'typeorm';

const dataSource = new DataSource({
  type: 'postgres',
  url: 'postgresql://postgres.ijqbjjczfhlxkwgurtuy:WYT5iMsK82058RZ5@aws-0-eu-west-1.pooler.supabase.com:6543/postgres',
  migrations: ['dist/migrations/*.js'],
  synchronize: false,
  ssl: {
    rejectUnauthorized: false,
  },
});

module.exports = { dataSource };
