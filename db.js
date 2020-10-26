'use sanity'

const initialize = async () => {
  const environment = process.env.DATABASE || 'sqlite3'
  const connection = require('./knexfile.js')[environment]
  if (!connection) {
    throw new Error('No Database Connection Found')
  }
  const knex = require('knex')(connection)
  await knex.migrate.latest()
  return knex
}

exports.initialize = initialize()
