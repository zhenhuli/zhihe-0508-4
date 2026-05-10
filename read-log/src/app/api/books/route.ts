import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/utils";

const MAX_PAGES = 100000;

export const runtime = "nodejs";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        readingSessions: true,
        reviews: true,
        progressHistory: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json(books);
  } catch (error) {
    console.error("获取书籍失败:", error);
    return NextResponse.json({ message: "获取书籍失败" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, author, totalPages, coverColor, coverImage, genre, description } = body;

    if (!title || !author || !totalPages) {
      return NextResponse.json({ message: "请填写必填字段" }, { status: 400 });
    }

    const totalPagesNum = Number(totalPages);
    if (isNaN(totalPagesNum) || totalPagesNum < 1) {
      return NextResponse.json({ message: "请输入有效的页数" }, { status: 400 });
    }
    if (totalPagesNum > MAX_PAGES) {
      return NextResponse.json(
        { message: `页数不能超过 ${MAX_PAGES.toLocaleString()}` },
        { status: 400 }
      );
    }

    const book = await prisma.book.create({
      data: {
        title,
        author,
        totalPages: totalPagesNum,
        coverColor: coverColor || "#64748b",
        coverImage: coverImage || null,
        genre,
        description,
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error("创建书籍失败:", error);
    return NextResponse.json({ message: "创建书籍失败" }, { status: 500 });
  }
}
