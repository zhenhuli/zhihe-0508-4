import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { BookStatus } from "@/lib/constants";

export const runtime = "nodejs";

export async function GET() {
  try {
    const [totalBooks, readingBooks, completedBooks, pausedBooks, sessions] =
      await Promise.all([
        prisma.book.count(),
        prisma.book.count({ where: { status: BookStatus.READING } }),
        prisma.book.count({ where: { status: BookStatus.COMPLETED } }),
        prisma.book.count({ where: { status: BookStatus.PAUSED } }),
        prisma.readingSession.findMany(),
      ]);

    const totalMinutes = sessions.reduce((sum, s) => sum + s.duration, 0);
    const totalPages = sessions.reduce((sum, s) => sum + (s.endPage - s.startPage), 0);

    const books = await prisma.book.findMany({
      include: {
        readingSessions: true,
      },
    });

    const genreStats: Record<string, number> = {};
    books.forEach((book) => {
      const genre = book.genre || "未分类";
      genreStats[genre] = (genreStats[genre] || 0) + 1;
    });

    const stats = {
      totalBooks,
      readingBooks,
      completedBooks,
      pausedBooks,
      notStartedBooks: totalBooks - readingBooks - completedBooks - pausedBooks,
      totalReadingMinutes: totalMinutes,
      totalReadingHours: Math.round(totalMinutes / 60),
      totalPagesRead: totalPages,
      averageMinutesPerSession: sessions.length > 0 ? Math.round(totalMinutes / sessions.length) : 0,
      genreStats,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("获取统计数据失败:", error);
    return NextResponse.json({ message: "获取统计数据失败" }, { status: 500 });
  }
}
