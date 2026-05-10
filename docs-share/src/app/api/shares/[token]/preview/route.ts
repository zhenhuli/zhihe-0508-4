import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import crypto from "crypto";
import mammoth from "mammoth";
import { prisma } from "@/lib/prisma";

function hashPassword(password: string): string {
  return crypto
    .createHash("sha256")
    .update(password + process.env.NEXTAUTH_SECRET)
    .digest("hex");
}

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password") || "";
    const format = searchParams.get("format") || "raw";

    const share = await prisma.share.findUnique({
      where: { token: params.token },
      include: { document: true },
    });

    if (!share) {
      return NextResponse.json({ message: "链接不存在" }, { status: 404 });
    }

    if (!share.isActive) {
      return NextResponse.json({ message: "链接已停用" }, { status: 403 });
    }

    if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
      return NextResponse.json({ message: "链接已过期" }, { status: 403 });
    }

    if (
      share.accessType === "PASSWORD" &&
      share.password !== hashPassword(password)
    ) {
      return NextResponse.json({ message: "未授权访问" }, { status: 401 });
    }

    await prisma.share.update({
      where: { token: params.token },
      data: { viewCount: { increment: 1 } },
    });

    const filePath = path.join(
      process.cwd(),
      "public",
      share.document.path
    );

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ message: "文件不存在" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);

    const isDocx =
      share.document.originalName.endsWith(".docx") ||
      share.document.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

    const isMarkdown =
      share.document.originalName.endsWith(".md") ||
      share.document.originalName.endsWith(".markdown");

    const isText =
      share.document.type.startsWith("text/") ||
      share.document.originalName.endsWith(".txt") ||
      share.document.originalName.endsWith(".json") ||
      share.document.originalName.endsWith(".js") ||
      share.document.originalName.endsWith(".ts") ||
      share.document.originalName.endsWith(".jsx") ||
      share.document.originalName.endsWith(".tsx") ||
      share.document.originalName.endsWith(".css") ||
      share.document.originalName.endsWith(".html");

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
        "Content-Type": share.document.type,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error) {
    console.error("获取分享预览失败:", error);
    return NextResponse.json(
      { message: "获取分享预览失败" },
      { status: 500 }
    );
  }
}
