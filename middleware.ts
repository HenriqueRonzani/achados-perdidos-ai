import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const SECRET = new TextEncoder().encode(process.env.JWT_SECRET)

interface TokenPayload {
  userId: string
  email?: string
}

export async function middleware(request: Request) {
  const authHeader = request.headers.get('Authorization')

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Nao autenticado' }, { status: 401 })
  }

  const token = authHeader.split(' ')[1]

  try {
    const { payload } = (await jwtVerify(token, SECRET)) as { payload: TokenPayload }

    const requestHeaders = new Headers(request.headers)
    requestHeaders.set('user-id', payload.userId)

    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  } catch (error: unknown) {
    console.log(error)
    return NextResponse.json({ error: 'Nao autorizado' }, { status: 401 })
  }
}

export const config = {
  matcher: '/api/app/:path*',
}
