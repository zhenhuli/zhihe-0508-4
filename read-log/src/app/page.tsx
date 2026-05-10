"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import BookCard from "@/components/BookCard";
import StatsCard from "@/components/StatsCard";
import { BookStatus } from "@/lib/constants";

const GENRES = [
  "全部",
  "小说",
  "文学",
  "历史",
  "哲学",
  "心理学",
  "商业",
  "科技",
  "传记",
  "其他",
  "未分类",
];

const ITEMS_PER_PAGE = 8;

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  const currentGenre = searchParams.get("genre") || "全部";
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const response = await fetch("/api/books");
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error("获取书籍失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (booksData: any[]) => {
    const readingBooks = booksData.filter(
      (b) => b.status === BookStatus.READING
    );
    const completedBooks = booksData.filter(
      (b) => b.status === BookStatus.COMPLETED
    );
    const totalMinutes = booksData.reduce((sum, book) => {
      return sum + book.readingSessions.reduce(
        (s: number, session: any) => s + session.duration,
        0
      );
    }, 0);

    setStats({
      total: booksData.length,
      reading: readingBooks.length,
      completed: completedBooks.length,
      totalMinutes,
    });
  };

  const filteredBooks = books.filter((book) => {
    if (currentGenre === "全部") return true;
    if (currentGenre === "未分类") return !book.genre;
    return book.genre === currentGenre;
  });

  const totalPages = Math.ceil(filteredBooks.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedBooks = filteredBooks.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleGenreChange = (genre: string) => {
    const params = new URLSearchParams(searchParams);
    if (genre === "全部") {
      params.delete("genre");
    } else {
      params.set("genre", genre);
    }
    params.set("page", "1");
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    router.push(`?${params.toString()}`);
  };

  if (loading) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-lg">加载中...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {stats && (
          <section className="mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatsCard
                icon="📚"
                label="全部书籍"
                value={stats.total}
                color="bg-purple-100"
              />
              <StatsCard
                icon="📖"
                label="正在阅读"
                value={stats.reading}
                color="bg-green-100"
              />
              <StatsCard
                icon="✅"
                label="已完成"
                value={stats.completed}
                color="bg-blue-100"
              />
              <StatsCard
                icon="⏱️"
                label="总阅读时长"
                value={Math.round(stats.totalMinutes / 60)}
                subValue={`${stats.totalMinutes % 60 > 0 ? `${stats.totalMinutes % 60}分钟` : ""}`}
                color="bg-yellow-100"
              />
            </div>
          </section>
        )}

        <section className="mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
            <h2 className="text-2xl font-bold">我的书架</h2>
            <Link
              href="/add-book"
              className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium"
            >
              <span>➕</span>
              添加书籍
            </Link>
          </div>

          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              {GENRES.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreChange(genre)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    currentGenre === genre
                      ? "bg-primary text-white"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>

          {books.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-semibold mb-2">书架空空如也</h3>
              <p className="text-muted-foreground mb-6">
                开始记录您的阅读之旅吧！添加第一本书。
              </p>
              <Link
                href="/add-book"
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
              >
                添加第一本书
              </Link>
            </div>
          ) : filteredBooks.length === 0 ? (
            <div className="bg-white rounded-xl border border-border p-12 text-center">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold mb-2">没有找到书籍</h3>
              <p className="text-muted-foreground">
                该分类下暂无书籍，请选择其他分类
              </p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginatedBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>

              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 rounded-lg border border-border bg-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ← 上一页
                  </button>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === page
                              ? "bg-primary text-white"
                              : "bg-secondary hover:bg-secondary/80"
                          }`}
                        >
                          {page}
                        </button>
                      )
                    )}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 rounded-lg border border-border bg-white hover:bg-secondary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    下一页 →
                  </button>
                </div>
              )}

              <div className="text-center text-sm text-muted-foreground mt-4">
                共 {filteredBooks.length} 本书，
                当前显示第 {startIndex + 1}-
                {Math.min(startIndex + ITEMS_PER_PAGE, filteredBooks.length)} 本
                {currentGenre !== "全部" && `（${currentGenre}）`}
              </div>
            </>
          )}
        </section>
      </div>

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>Read Log - 记录每一段阅读时光 📖</p>
        </div>
      </footer>
    </main>
  );
}
