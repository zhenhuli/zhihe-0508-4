import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";
import { checkShareAccess } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const password = searchParams.get("password") || "";

    const accessResult = await checkShareAccess(params.token, password);

    if (!accessResult.allowed) {
      const statusMap: Record<string, number> = {
        not_found: 404,
        not_active: 403,
        expired: 403,
        wrong_password: 401,
      };
      const messageMap: Record<string, string> = {
        not_found: "链接不存在",
        not_active: "链接已停用",
        expired: "链接已过期",
        wrong_password: "密码错误",
      };
      return NextResponse.json(
        { message: messageMap[accessResult.reason] || "无权访问" },
        { status: statusMap[accessResult.reason] || 403 }
      );
    }

    const { share } = accessResult;

    const filePath = path.join(process.cwd(), "public", share.document.path);

    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json({ message: "文件不存在" }, { status: 404 });
    }

    const fileBuffer = await fs.readFile(filePath);
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": share.document.type,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(share.document.originalName)}"`,
      },
    });
  } catch (error) {
    console.error("下载分享文件失败:", error);
    return NextResponse.json(
      { message: "下载分享文件失败" },
      { status: 500 }
    );
  }
}
