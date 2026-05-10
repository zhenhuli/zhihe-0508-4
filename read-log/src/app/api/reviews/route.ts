import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId, content, rating } = body;

    if (!bookId || !content || rating === undefined) {
      return NextResponse.json({ message: "请填写必填字段" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ message: "书籍不存在" }, { status: 404 });
    }

    const review = await prisma.review.create({
      data: {
        bookId,
        content,
        rating: parseInt(rating),
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error("创建评论失败:", error);
    return NextResponse.json({ message: "创建评论失败" }, { status: 500 });
  }
}
