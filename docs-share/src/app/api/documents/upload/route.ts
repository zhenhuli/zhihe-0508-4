import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const userId = getCurrentUserId();
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!userId) {
      return NextResponse.json(
        { message: "无法识别用户身份" },
        { status: 401 }
      );
    }

    if (!file) {
      return NextResponse.json({ message: "未提供文件" }, { status: 400 });
    }

    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json(
        { message: "文件大小不能超过 50MB" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const ext = path.extname(file.name);
    const fileName = `${id}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const document = await prisma.document.create({
      data: {
        id,
        name: fileName,
        originalName: file.name,
        size: file.size,
        type: file.type || "application/octet-stream",
        path: `/uploads/${fileName}`,
        uploaderId: userId,
      },
    });

    return NextResponse.json({ id: document.id });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json(
      { message: "上传失败，请重试" },
      { status: 500 }
    );
  }
}
