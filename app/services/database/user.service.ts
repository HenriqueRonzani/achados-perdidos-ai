import { User } from "@/app/types/entities"
import { neon } from '@neondatabase/serverless'

const sql = neon(process.env.DATABASE_URL!)

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

export const getUsers = async (q?: string) => {
  const sql = neon(process.env.DATABASE_URL as string)

  if (q) {
    const data = await sql`
      SELECT id, name, email
      FROM users
      WHERE name ILIKE ${'%' + q + '%'}
         OR email ILIKE ${'%' + q + '%'}
      ORDER BY id
    `
    return data
  }

  const data = await sql`
    SELECT id, name, email
    FROM users
    ORDER BY id
  `
  return data
}

export const updateUser = async (userId: number, name: string, email: string) => {
  const sql = neon(process.env.DATABASE_URL as string)

  const result = await sql`
    UPDATE users
    SET name = ${name}, email = ${email}
    WHERE id = ${userId}
    RETURNING id, name, email;
  `

  return result[0]
}
