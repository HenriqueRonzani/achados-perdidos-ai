import { getUsers } from "@/app/services/database/user.service";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get('q') ?? undefined;
    const response = await getUsers(q);
    return NextResponse.json(response);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error: 'Erro durante a consulta' }, { status: 500 });
  }
}
