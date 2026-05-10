import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";
import { checkDocumentAccess } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action") || "preview";

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ message: "文档不存在" }, { status: 404 });
    }

    const accessResult = await checkDocumentAccess(params.id);
    if (!accessResult.allowed) {
      if (accessResult.reason === "private") {
        return NextResponse.json(
          { message: "文档为私有，请使用分享链接访问" },
          { status: 403 }
        );
      }
      return NextResponse.json({ message: "无权访问此文档" }, { status: 403 });
    }

    const filePath = path.join(process.cwd(), "public", document.path);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ message: "文件不存在" }, { status: 404 });
    }

    if (action === "download") {
      const fileBuffer = await fs.readFile(filePath);
      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": document.type,
          "Content-Disposition": `attachment; filename="${encodeURIComponent(document.originalName)}"`,
        },
      });
    }

    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": document.type,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("获取文档失败:", error);
    return NextResponse.json(
      { message: "获取文档失败" },
      { status: 500 }
    );
  }
}
