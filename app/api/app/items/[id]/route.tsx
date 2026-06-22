import { AddItemForm } from "@/app/(main)/items/add-item-modal";
import { EditItemForm } from "@/app/(main)/items/edit-item-modal";
import { updateItem } from "@/app/services/database/item.service";
import { NextRequest, NextResponse } from "next/server";

type RouteParams = {
  params: Promise<{ id: string }>
}

export async function PUT(request: NextRequest, {params}: RouteParams) {
    try {
        const {id} = await params
        const body = await request.json() as EditItemForm;
        const response = updateItem(Number(id), body)
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