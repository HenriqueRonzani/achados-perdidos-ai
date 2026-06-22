
import { archiveItem } from "@/app/services/database/item.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PATCH(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params
        const status = request.nextUrl.searchParams.get('status') as string
        const response = archiveItem(Number(id), status)
        return NextResponse.json({
            response
        }, { status: 200 })
    } catch (error: unknown) {
        console.log(error)
        return NextResponse.json({
        message: 'Houve um erro'
        }, { status: 500 })
  }
}