import { getUsers, UsersFilterType } from "@/app/services/database/user.service"
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const search = request.nextUrl.searchParams.get('q');
    const filters = {
      name: search,
      email: search,
    } as UsersFilterType

    const response = await getUsers(filters)
    return NextResponse.json(response)
  } catch (error) {
    console.log(error)
    return NextResponse.json({ error: 'Erro durante a consulta' }, { status: 500 })
  }
}
