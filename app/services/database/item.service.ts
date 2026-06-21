import { AddItemForm } from "@/app/(main)/items/add-item-modal";
import { neon } from "@neondatabase/serverless";

type OptionalString = string | undefined

export type ItemsFilterType = {
  name: OptionalString
  description: OptionalString
  tags: OptionalString
  location: OptionalString
}

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

export const getItems = async (filters?: ItemsFilterType) => {
  const sql = neon(process.env.DATABASE_URL as string)

  const { conditions, values } = makeDynamicFilters(filters)

  let queryString = `SELECT * FROM items`
  if (conditions.length > 0) {
    queryString += ` WHERE ${conditions.join(' OR ')}`
  }

  const data = await sql.query(queryString, values)

  return data
}

export const insertItem = async (userId: number, item: AddItemForm, aiTags: string | null) => {
  const sql = neon(process.env.DATABASE_URL as string)

  const result = await sql`
    INSERT INTO items
    (name, description, status, location, date_reported, date_claimed, image_url, user_id, tags)
    VALUES
    (${item.name}, ${item.description}, 'open', ${item.location}, NOW(), null, ${item.image_url}, ${userId}, ${aiTags})
    RETURNING *;
  `

  return result[0];
}
