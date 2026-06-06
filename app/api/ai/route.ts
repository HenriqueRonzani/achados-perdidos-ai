import { promptIa } from "@/app/services/api/groq.service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  return NextResponse.json(promptIa(request))
}
