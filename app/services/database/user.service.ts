import { User } from "@/app/types/entities"
import { neon } from '@neondatabase/serverless'
import { AddUserForm } from "@/app/(main)/users/add-user-modal";

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
<<<<<<< Updated upstream
=======

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

export const getUsers = async (filters?: UsersFilterType): Promise<SafeUser[]> => {
  const sql = neon(process.env.DATABASE_URL as string)

  const { conditions, values } = makeDynamicFilters(filters)

  let queryString = `SELECT id, name, email FROM users ORDER BY id`
  if (conditions.length > 0) {
    queryString += ` WHERE ${conditions.join(' OR ')}`
  }

  const data = await sql.query(queryString, values)

  return data as SafeUser[]
}

export const createUser = async (name: string, email: string, passwordHash: string = "") => {
  const sql = neon(process.env.DATABASE_URL as string)

  const result = await sql`
    INSERT INTO users (name, email, password)
    VALUES (${name}, ${email}, ${passwordHash})
    RETURNING id, name, email;
  `

  return result[0] as SafeUser
}

export const addUser = async (data: AddUserForm) => {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    // Se a API retornar uma mensagem de erro (ex: 'Este e-mail já está em uso')
    throw new Error(result.error || 'Erro ao criar usuário');
  }

  return result;
};
>>>>>>> Stashed changes
