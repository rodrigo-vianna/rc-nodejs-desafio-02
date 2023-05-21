import { Knex } from 'knex'

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('email').notNullable().unique()
    table.text('session_key').nullable()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary()
    table.text('name').notNullable()
    table.text('description').nullable()
    table.boolean('on_the_diet').notNullable()
    table.uuid('user_id').notNullable().references('id').inTable('users')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
  await knex.schema.dropTable('users')
}
