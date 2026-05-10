import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { isPublic } = body;

    if (typeof isPublic !== "boolean") {
      return NextResponse.json(
        { message: "isPublic 必须是布尔值" },
        { status: 400 }
      );
    }

    const document = await prisma.document.update({
      where: { id: params.id },
      data: { isPublic },
    });

    return NextResponse.json(document);
  } catch (error) {
    console.error("更新文档设置失败:", error);
    return NextResponse.json(
      { message: "更新文档设置失败" },
      { status: 500 }
    );
  }
}
