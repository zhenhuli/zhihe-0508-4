import { NextRequest, NextResponse } from "next/server";
import { checkShareAccess } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(
  request: NextRequest,
  { params }: { params: { token: string } }
) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { message: "请输入密码" },
        { status: 400 }
      );
    }

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
        { message: messageMap[accessResult.reason] || "验证失败" },
        { status: statusMap[accessResult.reason] || 403 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("验证密码失败:", error);
    return NextResponse.json(
      { message: "验证失败" },
      { status: 500 }
    );
  }
}
