import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
    const timestamp = knex.raw('CURRENT_TIMESTAMP');

    // Deletes ALL existing entries
    await knex("parking_lots").del();

    // Inserts seed entries
    await knex("parking_lots").insert([
        { label: "A1", created_at: timestamp, updated_at: timestamp },
        { label: "A2", created_at: timestamp, updated_at: timestamp },
        { label: "A3", created_at: timestamp, updated_at: timestamp },
        { label: "A4", created_at: timestamp, updated_at: timestamp },
        { label: "B1", created_at: timestamp, updated_at: timestamp },
        { label: "B2", created_at: timestamp, updated_at: timestamp },
        { label: "B3", created_at: timestamp, updated_at: timestamp },
        { label: "B4", created_at: timestamp, updated_at: timestamp },
        { label: "C1", created_at: timestamp, updated_at: timestamp },
        { label: "C2", created_at: timestamp, updated_at: timestamp },
        { label: "C3", created_at: timestamp, updated_at: timestamp },
        { label: "C4", created_at: timestamp, updated_at: timestamp }
    ]);
};
