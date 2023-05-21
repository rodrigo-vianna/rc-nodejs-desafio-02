import { Knex } from 'knex'
import env from './src/env'

const config: Knex.Config = {
  client: "sqlite3",
  connection: {
    filename: env.DATABASE_URL,
  },
  migrations: {
    extension: 'ts',
    directory: './db/migrations',
  },
  useNullAsDefault: true,
}

export default config
