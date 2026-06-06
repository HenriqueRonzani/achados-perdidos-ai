import { neon } from "@neondatabase/serverless";

type OptionalString = string | undefined

export type ItemsFilterType = {
  name: OptionalString
  description: OptionalString
  category: OptionalString
  location: OptionalString
}

const makeDinamicFilters = (filters: object) => {
  const conditions: string[] = []
  const values: string[] = []

  Object.entries(filters).forEach(([field, value], index) => {
    if (!/^[a-zA-Z0-9_]+$/.test(field)) return;

    if (value !== undefined && value !== null) {
      conditions.push(`${field} = $${index + 1}`);
      values.push(value);
    }
  }
  );

  return { conditions, values }
}

export const getItems = async (filters: ItemsFilterType) => {
  const sql = neon(process.env.DATABASE_URL as string)

  const { conditions, values } = makeDinamicFilters(filters)

  let queryString = `SELECT * FROM items`

  if (conditions.length > 0) {
    queryString += `WHERE ${conditions.join(' AND ')}`
  }

  const data = await sql.query(queryString, values)

  return data
}
