import { neon } from "@neondatabase/serverless";

type OptionalString = string | undefined

export type ItemsFilterType = {
  name: OptionalString
  description: OptionalString
  category: OptionalString
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
  console.log(filters)
  if (conditions.length > 0) {
    queryString += ` WHERE ${conditions.join(' OR ')}`
  }

  console.log(queryString)

  const data = await sql.query(queryString, values)

  return data
}
