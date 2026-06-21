import { AddItemForm } from "@/app/(main)/items/add-item-modal";
import { getAiTags } from "@/app/services/ai/groq.service";
import { getItems, insertItem, ItemsFilterType } from "@/app/services/database/item.service"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('q');
    const filters = {
      name: search,
      description: search,
      tags: search,
      location: search
    } as ItemsFilterType

    const response = await getItems(filters)
    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Erro durante a consulta' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = Number(request.headers.get('user-id'))

    const body = await request.json() as AddItemForm;

    const aiTags = await getAiTags(body.description, body.image_url)

    const response = insertItem(userId, body, aiTags)

    return NextResponse.json({
      response
    }, { status: 201 })
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({
      message: 'Houve um erro'
    }, { status: 500 })
  }
}
