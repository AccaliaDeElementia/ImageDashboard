// Update with your config settings.

module.exports = {
  sqlite3: {
    client: 'sqlite3',
    connection: {
      filename: './server.sqlite3'
    },
    useNullAsDefault: true,
    migrations: {
      tableName: 'knex_migrations'
    }
  },
  postgresql: {
    client: 'postgresql',
    connection: {
      host: process.env.POSTGRES_HOST || 'postgres',
      database: process.env.POSTGRES_DATABASE || 'postgres',
      user: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      tableName: 'knex_migrations'
    }
  }
}
