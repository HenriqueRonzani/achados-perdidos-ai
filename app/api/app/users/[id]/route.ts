import { updateUser } from "@/app/services/database/user.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, email } = body;

    const response = await updateUser(Number(id), name, email);
    return NextResponse.json(response, { status: 200 });
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({ message: 'Houve um erro' }, { status: 500 });
  }
}
