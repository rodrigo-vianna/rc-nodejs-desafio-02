// eslint-disable-next-line
import { Knex } from 'knex';

declare module 'knex/types/tables' {
  export interface Tables {
    users: {
      id: string
      name: string
      email: string
      session_key?: string
      created_at: Date
    }
    meals: {
      id: string
      name: string
      description?: string | null
      on_the_diet: boolean
      user_id: string
      created_at: Date
    }
  }
}
