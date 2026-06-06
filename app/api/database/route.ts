import { getItems, ItemsFilterType } from "@/app/services/database/item.service"
import { NextResponse } from "next/server";

type RouteContext = {
  params: Promise<ItemsFilterType>
}

export async function GET(_: Request, context: RouteContext) {
  try {
    const filters = await context.params;
    const response = getItems(filters)
    return NextResponse.json({ response })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Erro durante a consulta' }, { status: 500 })
  }
}
