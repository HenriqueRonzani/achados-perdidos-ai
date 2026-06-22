import { User } from "@/app/types/entities"
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

type OptionalString = string | undefined

export type UsersFilterType = {
  name: OptionalString
  email: OptionalString
}

export type SafeUser = Omit<User, "password">

const makeDynamicFilters = (filters?: object) => {
  const conditions: string[] = []
  const values: unknown[] = []

  Object.entries(filters ?? {}).forEach(([field, value]) => {
    if (!/^[a-zA-Z0-9_]+$/.test(field)) return;

    if (value !== undefined && value !== null) {
      conditions.push(`${field} ILIKE $${values.length + 1}`);
      values.push(`%${value}%`);
    }
  }
  );

  return { conditions, values }
}

export const getUserByEmail = async (
  email: string,
): Promise<User | null> => {
  const users = await sql`
    SELECT *
    FROM users
    WHERE email = ${email}
    LIMIT 1
  `

  return users[0] as User ?? null
}

export const getUsers = async (filters?: UsersFilterType): Promise<SafeUser[]> => {
  const sql = neon(process.env.DATABASE_URL as string)

  const { conditions, values } = makeDynamicFilters(filters)

  let queryString = `SELECT id, name, email FROM users`
  if (conditions.length > 0) {
    queryString += ` WHERE ${conditions.join(' OR ')}`
  }

  const data = await sql.query(queryString, values)

  return data as SafeUser[]
}
