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
