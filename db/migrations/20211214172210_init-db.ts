import { Knex } from "knex";


export async function up(knex: Knex): Promise<any> {
    return knex.schema
        .createTable('parking_lots', (table) => {
            table.increments('id').primary();
            table.string('label', 255).notNullable();
            table.enum('status', ['available', 'in-used']).notNullable().defaultTo('available');
            table.timestamps();
        })
        .createTable('tickets', (table) =>{
            table.increments('id').primary();
            table.string('car_plate_no', 50).notNullable();
            table.enum('car_size', ['small', 'medium', 'large']).notNullable();
            table.integer('parking_lot_id', 10).notNullable();
            table.boolean('is_checkout').notNullable().defaultTo(false);
            table.timestamps();
        });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema
      .dropTable("parking_lots")
      .dropTable("tickets");
}

