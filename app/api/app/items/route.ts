import { getItems, ItemsFilterType } from "@/app/services/database/item.service"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('q');
    const filters = {
      name: search,
      description: search,
      category: search,
      location: search
    } as ItemsFilterType

    const response = await getItems(filters)
    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Erro durante a consulta' }, { status: 500 })
  }
}
