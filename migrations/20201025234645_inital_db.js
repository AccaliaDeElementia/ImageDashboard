
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable('images', (table) => {
      table.string('image', 8192).unique()
      table.index('image')
    }),
    knex.schema.createTable('syncitems', (table) => {
      table.string('image', 8192)
      table.index('image')
    })
  ])
}

exports.down = function (knex) {
  return Promise.all([
    knex.schema.dropTable('images'),
    knex.schema.dropTable('syncitems')
  ])
}
