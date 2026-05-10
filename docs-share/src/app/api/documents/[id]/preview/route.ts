import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import mammoth from "mammoth";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getCurrentUserId();
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "raw";

    const document = await prisma.document.findUnique({
      where: { id: params.id },
    });

    if (!document) {
      return NextResponse.json({ message: "文档不存在" }, { status: 404 });
    }

    if (document.uploaderId && document.uploaderId !== userId) {
      return NextResponse.json({ message: "无权访问" }, { status: 403 });
    }

    const filePath = path.join(process.cwd(), "public", document.path);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ message: "文件不存在" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    const isDocx =
      document.originalName.endsWith(".docx") ||
      document.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const isMarkdown =
      document.originalName.endsWith(".md") ||
      document.originalName.endsWith(".markdown");

    const isText =
      document.type.startsWith("text/") ||
      document.originalName.endsWith(".txt") ||
      document.originalName.endsWith(".json") ||
      document.originalName.endsWith(".js") ||
      document.originalName.endsWith(".ts") ||
      document.originalName.endsWith(".jsx") ||
      document.originalName.endsWith(".tsx") ||
      document.originalName.endsWith(".css") ||
      document.originalName.endsWith(".html");

    if (format === "html" && isDocx) {
      const result = await mammoth.convertToHtml({ buffer: fileBuffer });
      return NextResponse.json({
        html: result.value,
        messages: result.messages,
      });
    }

    if (format === "text" && (isMarkdown || isText)) {
      const text = fileBuffer.toString("utf-8");
      return NextResponse.json({
        text,
        isMarkdown,
      });
    }

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": document.type,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("获取文档预览失败:", error);
    return NextResponse.json(
      { message: "获取文档预览失败" },
      { status: 500 }
    );
  }
}
