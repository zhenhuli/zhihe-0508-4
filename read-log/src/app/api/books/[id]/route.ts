import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { calculateProgress } from "@/lib/utils";
import { BookStatus } from "@/lib/constants";

const MAX_PAGES = 100000;

export const runtime = "nodejs";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
      include: {
        readingSessions: {
          orderBy: { date: "desc" },
        },
        reviews: {
          orderBy: { createdAt: "desc" },
        },
        progressHistory: {
          orderBy: { date: "desc" },
        },
      },
    });

    if (!book) {
      return NextResponse.json({ message: "书籍不存在" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("获取书籍详情失败:", error);
    return NextResponse.json({ message: "获取书籍详情失败" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const {
      title,
      author,
      totalPages,
      currentPage,
      status,
      coverColor,
      coverImage,
      genre,
      description,
    } = body;

    const existingBook = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!existingBook) {
      return NextResponse.json({ message: "书籍不存在" }, { status: 404 });
    }

    const updateData: any = {};
    if (title) updateData.title = title;
    if (author) updateData.author = author;
    if (coverColor) updateData.coverColor = coverColor;
    if (coverImage !== undefined) updateData.coverImage = coverImage || null;
    if (genre !== undefined) updateData.genre = genre;
    if (description !== undefined) updateData.description = description;
    if (status) updateData.status = status;

    if (totalPages) {
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
      updateData.totalPages = totalPagesNum;
    }

    if (currentPage !== undefined) {
      const parsedCurrentPage = Number(currentPage);
      if (isNaN(parsedCurrentPage) || parsedCurrentPage < 0) {
        return NextResponse.json({ message: "请输入有效的页码" }, { status: 400 });
      }

      const newTotalPages = totalPages ? Number(totalPages) : existingBook.totalPages;
      updateData.currentPage = Math.min(parsedCurrentPage, newTotalPages);

      const newStatus =
        parsedCurrentPage >= newTotalPages
          ? BookStatus.COMPLETED
          : parsedCurrentPage > 0
          ? BookStatus.READING
          : BookStatus.NOT_STARTED;

      if (!updateData.status) {
        updateData.status = newStatus;
      }

      const percentage = calculateProgress(parsedCurrentPage, newTotalPages);

      await prisma.progressHistory.create({
        data: {
          bookId: params.id,
          currentPage: updateData.currentPage,
          percentage,
        },
      });
    }

    const updatedBook = await prisma.book.update({
      where: { id: params.id },
      data: updateData,
      include: {
        readingSessions: true,
        reviews: true,
        progressHistory: true,
      },
    });

    return NextResponse.json(updatedBook);
  } catch (error) {
    console.error("更新书籍失败:", error);
    return NextResponse.json({ message: "更新书籍失败" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const book = await prisma.book.findUnique({
      where: { id: params.id },
    });

    if (!book) {
      return NextResponse.json({ message: "书籍不存在" }, { status: 404 });
    }

    await prisma.book.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "书籍已删除" });
  } catch (error) {
    console.error("删除书籍失败:", error);
    return NextResponse.json({ message: "删除书籍失败" }, { status: 500 });
  }
}
