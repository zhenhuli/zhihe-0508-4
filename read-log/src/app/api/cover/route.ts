import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ message: "未提供文件" }, { status: 400 });
    }

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { message: "只支持 JPG、PNG、WebP、GIF 格式的图片" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { message: "文件大小不能超过 10MB" },
        { status: 400 }
      );
    }

    const id = uuidv4();
    const ext = path.extname(file.name) || ".jpg";
    const fileName = `${id}${ext}`;

    const uploadsDir = path.join(process.cwd(), "public", "uploads", "covers");
    await fs.mkdir(uploadsDir, { recursive: true });

    const filePath = path.join(uploadsDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    return NextResponse.json({
      success: true,
      url: `/uploads/covers/${fileName}`,
    });
  } catch (error) {
    console.error("上传失败:", error);
    return NextResponse.json(
      { message: "上传失败，请重试" },
      { status: 500 }
    );
  }
}
