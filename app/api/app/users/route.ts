import { getUsers, getUserByEmail, createUser, UsersFilterType } from "@/app/services/database/user.service"
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";

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

export async function POST(request: NextRequest) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email) {
      return NextResponse.json({ error: 'Nome e E-mail são obrigatórios.' }, { status: 400 });
    }

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json({ error: 'Este e-mail já está em uso.' }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = password ? await bcrypt.hash(password, salt) : "";

    const newUser = await createUser(name, email, hashedPassword);

    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error("Erro no POST /api/app/users:", error);
    return NextResponse.json({ error: 'Erro ao salvar o usuário' }, { status: 500 });
  }
}