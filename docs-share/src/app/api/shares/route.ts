import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { documentId, accessType, password, expiresAt } = body;

    if (!documentId) {
      return NextResponse.json(
        { message: "缺少 documentId" },
        { status: 400 }
      );
    }

    const document = await prisma.document.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return NextResponse.json({ message: "文档不存在" }, { status: 404 });
    }

    const validAccessTypes = ["LINK_ONLY", "PASSWORD"];
    if (accessType && !validAccessTypes.includes(accessType)) {
      return NextResponse.json(
        { message: "无效的访问权限类型" },
        { status: 400 }
      );
    }

    if (accessType === "PASSWORD" && !password) {
      return NextResponse.json(
        { message: "密码保护类型需要设置密码" },
        { status: 400 }
      );
    }

    const token = uuidv4().replace(/-/g, "").substring(0, 16);

    const share = await prisma.share.create({
      data: {
        documentId,
        token,
        accessType,
        password: password ? hashPassword(password) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
      },
    });

    return NextResponse.json(share);
  } catch (error) {
    console.error("创建分享链接失败:", error);
    return NextResponse.json(
      { message: "创建分享链接失败" },
      { status: 500 }
    );
  }
}
