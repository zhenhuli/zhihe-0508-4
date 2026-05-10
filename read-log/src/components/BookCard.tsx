"use client";

import Link from "next/link";
import { Book } from "@prisma/client";
import { calculateProgress } from "@/lib/utils";

interface BookCardProps {
  book: Book & {
    readingSessions: any[];
    reviews: any[];
    progressHistory: any[];
  };
}

const statusLabels: Record<string, string> = {
  NOT_STARTED: "未开始",
  READING: "阅读中",
  COMPLETED: "已完成",
  PAUSED: "已暂停",
};

const statusColors: Record<string, string> = {
  NOT_STARTED: "bg-gray-200 text-gray-700",
  READING: "bg-green-100 text-green-700",
  COMPLETED: "bg-blue-100 text-blue-700",
  PAUSED: "bg-yellow-100 text-yellow-700",
};

export default function BookCard({ book }: BookCardProps) {
  const progress = calculateProgress(book.currentPage, book.totalPages);
  const totalMinutes = book.readingSessions.reduce(
    (sum, session) => sum + session.duration,
    0
  );
  const totalHours = Math.round(totalMinutes / 60);

  return (
    <Link
      href={`/books/${book.id}`}
      className="group bg-white rounded-xl border border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      <div className="h-40 relative overflow-hidden">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: book.coverColor }}
          >
            <div className="text-white text-6xl opacity-30 group-hover:scale-110 transition-transform duration-300">
              📕
            </div>
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[book.status]}`}
          >
            {statusLabels[book.status]}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1 line-clamp-1 group-hover:text-primary transition-colors">
          {book.title}
        </h3>
        <p className="text-muted-foreground text-sm mb-3">{book.author}</p>

        <div className="mb-3">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>
              {book.currentPage} / {book.totalPages} 页
            </span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>⏱️</span>
            <span>
              {totalHours > 0
                ? `${totalHours}小时${totalMinutes % 60 > 0 ? ` ${totalMinutes % 60}分` : ""}`
                : `${totalMinutes}分钟`}
            </span>
          </div>
          {book.reviews.length > 0 && (
            <div className="flex items-center gap-1">
              <span>⭐</span>
              <span>{book.reviews.length}条短评</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
