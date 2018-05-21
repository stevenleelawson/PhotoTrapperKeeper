exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('photos', (table) => {
      table.increments('id').primary();
      table.string('title');
      table.string('photo_url')

      table.timestamps(true, true)
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('photos')
  ])
};
