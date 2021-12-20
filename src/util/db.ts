import * as Knex from 'knex'
import * as config from '../../knexfile';

export const db = Knex.knex(config)