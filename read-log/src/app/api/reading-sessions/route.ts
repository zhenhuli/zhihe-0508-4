import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/utils";
import { BookStatus } from "@/lib/constants";

const MAX_PAGES = 100000;

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookId, startPage, endPage, duration, note, date } = body;

    if (!bookId || startPage === undefined || endPage === undefined || !duration) {
      return NextResponse.json({ message: "请填写必填字段" }, { status: 400 });
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ message: "书籍不存在" }, { status: 404 });
    }

    const startPageNum = Number(startPage);
    const endPageNum = Number(endPage);

    if (isNaN(startPageNum) || startPageNum < 0) {
      return NextResponse.json({ message: "请输入有效的起始页码" }, { status: 400 });
    }
    if (isNaN(endPageNum) || endPageNum < 0) {
      return NextResponse.json({ message: "请输入有效的结束页码" }, { status: 400 });
    }
    if (endPageNum > MAX_PAGES) {
      return NextResponse.json(
        { message: `页码不能超过 ${MAX_PAGES.toLocaleString()}` },
        { status: 400 }
      );
    }

    const newCurrentPage = Math.max(book.currentPage, endPageNum);
    const newStatus =
      newCurrentPage >= book.totalPages
        ? BookStatus.COMPLETED
        : newCurrentPage > 0
        ? BookStatus.READING
        : BookStatus.NOT_STARTED;

    const readingSession = await prisma.readingSession.create({
      data: {
        bookId,
        startPage: startPageNum,
        endPage: endPageNum,
        duration: parseInt(duration),
        note,
        date: date ? new Date(date) : new Date(),
      },
    });

    const percentage = calculateProgress(
      Math.min(newCurrentPage, book.totalPages),
      book.totalPages
    );

    await prisma.progressHistory.create({
      data: {
        bookId,
        currentPage: Math.min(newCurrentPage, book.totalPages),
        percentage,
      },
    });

    await prisma.book.update({
      where: { id: bookId },
      data: {
        currentPage: Math.min(newCurrentPage, book.totalPages),
        status: newStatus,
      },
    });

    return NextResponse.json(readingSession, { status: 201 });
  } catch (error) {
    console.error("创建阅读记录失败:", error);
    return NextResponse.json({ message: "创建阅读记录失败" }, { status: 500 });
  }
}
