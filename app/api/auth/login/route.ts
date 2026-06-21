import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { SignJWT } from "jose"
import { getUserByEmail } from "@/app/services/database/user.service"

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const user = await getUserByEmail(email)

    if (!user || !user.password) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 })
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { error: 'Credenciais inválidas' },
        { status: 401 }
      )
    }

    const token = await new SignJWT({ email, userId: user.id })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('8h')
      .sign(SECRET)

    return NextResponse.json({ token }, { status: 200 })

  } catch (error) {
    console.error("Erro na rota de login:", error)
    return NextResponse.json(
      { error: 'Erro interno no servidor' },
      { status: 500 }
    )
  }
}
