"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { calculateProgress, formatDuration } from "@/lib/utils";

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

interface BookDetailProps {
  params: { id: string };
}

export default function BookDetailPage({ params }: BookDetailProps) {
  const router = useRouter();
  const [book, setBook] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"progress" | "reviews" | "history">("progress");
  const [progressValue, setProgressValue] = useState("");
  const [readingForm, setReadingForm] = useState({
    startPage: "",
    endPage: "",
    duration: "",
    note: "",
  });
  const [reviewForm, setReviewForm] = useState({
    content: "",
    rating: "5",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchBook();
  }, [params.id]);

  const fetchBook = async () => {
    try {
      const response = await fetch(`/api/books/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setBook(data);
        setProgressValue(data.currentPage.toString());
        setReadingForm((prev) => ({
          ...prev,
          startPage: data.currentPage.toString(),
        }));
      }
    } catch (error) {
      console.error("获取书籍详情失败:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProgress = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/books/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPage: progressValue,
        }),
      });

      if (response.ok) {
        fetchBook();
        alert("进度已更新！");
      }
    } catch (error) {
      console.error("更新进度失败:", error);
      alert("更新进度失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReadingSession = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reading-sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: params.id,
          ...readingForm,
        }),
      });

      if (response.ok) {
        fetchBook();
        setReadingForm({
          startPage: "",
          endPage: "",
          duration: "",
          note: "",
        });
        alert("阅读记录已添加！");
      }
    } catch (error) {
      console.error("添加阅读记录失败:", error);
      alert("添加阅读记录失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddReview = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookId: params.id,
          ...reviewForm,
        }),
      });

      if (response.ok) {
        fetchBook();
        setReviewForm({
          content: "",
          rating: "5",
        });
        alert("短评已添加！");
      }
    } catch (error) {
      console.error("添加短评失败:", error);
      alert("添加短评失败，请重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("确定要删除这本书吗？此操作不可撤销。")) {
      return;
    }

    try {
      const response = await fetch(`/api/books/${params.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      console.error("删除书籍失败:", error);
      alert("删除书籍失败，请重试");
    }
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

  if (!book) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="text-lg">书籍不存在</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-lg"
          >
            返回
          </button>
        </div>
      </main>
    );
  }

  const progress = calculateProgress(book.currentPage, book.totalPages);
  const totalMinutes = book.readingSessions.reduce(
    (sum: number, session: any) => sum + session.duration,
    0
  );

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors mb-6"
        >
          <span>←</span>
          <span>返回书架</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-border overflow-hidden">
              <div className="h-48 relative">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ backgroundColor: book.coverColor }}
                  >
                    <div className="text-white text-8xl opacity-30">📕</div>
                  </div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1 className="text-2xl font-bold mb-1">{book.title}</h1>
                    <p className="text-muted-foreground">{book.author}</p>
                  </div>
                  <span
                    className={`text-sm px-3 py-1 rounded-full font-medium ${statusColors[book.status]}`}
                  >
                    {statusLabels[book.status]}
                  </span>
                </div>

                {book.genre && (
                  <div className="mb-4">
                    <span className="inline-block text-xs px-2 py-1 bg-secondary rounded-full text-muted-foreground">
                      {book.genre}
                    </span>
                  </div>
                )}

                {book.description && (
                  <p className="text-muted-foreground text-sm mb-4">
                    {book.description}
                  </p>
                )}

                <ProgressBar
                  value={book.currentPage}
                  max={book.totalPages}
                  className="mb-4"
                />

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="text-xl font-bold">{book.totalPages}</div>
                    <div className="text-xs text-muted-foreground">总页数</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="text-xl font-bold">
                      {formatDuration(totalMinutes)}
                    </div>
                    <div className="text-xs text-muted-foreground">阅读时长</div>
                  </div>
                  <div className="bg-secondary/50 rounded-lg p-3">
                    <div className="text-xl font-bold">
                      {book.readingSessions.length}
                    </div>
                    <div className="text-xs text-muted-foreground">阅读次数</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border">
              <div className="border-b border-border">
                <div className="flex">
                  {[
                    { id: "progress", label: "更新进度" },
                    { id: "reviews", label: "短评" },
                    { id: "history", label: "阅读历史" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() =>
                        setActiveTab(tab.id as "progress" | "reviews" | "history")
                      }
                      className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? "text-primary border-b-2 border-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {activeTab === "progress" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">快速更新进度</h3>
                      <form onSubmit={handleUpdateProgress} className="flex gap-3">
                        <input
                          type="number"
                          value={progressValue}
                          onChange={(e) => setProgressValue(e.target.value)}
                          min="0"
                          max={book.totalPages}
                          placeholder="当前页码"
                          className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-6 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          更新
                        </button>
                      </form>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">添加阅读记录</h3>
                      <form
                        onSubmit={handleAddReadingSession}
                        className="space-y-4"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-sm font-medium">
                              起始页
                            </label>
                            <input
                              type="number"
                              value={readingForm.startPage}
                              onChange={(e) =>
                                setReadingForm({
                                  ...readingForm,
                                  startPage: e.target.value,
                                })
                              }
                              min="0"
                              max={book.totalPages}
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="block text-sm font-medium">
                              结束页
                            </label>
                            <input
                              type="number"
                              value={readingForm.endPage}
                              onChange={(e) =>
                                setReadingForm({
                                  ...readingForm,
                                  endPage: e.target.value,
                                })
                              }
                              min="0"
                              max={book.totalPages}
                              required
                              className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            阅读时长（分钟）
                          </label>
                          <input
                            type="number"
                            value={readingForm.duration}
                            onChange={(e) =>
                              setReadingForm({
                                ...readingForm,
                                duration: e.target.value,
                              })
                            }
                            min="1"
                            placeholder="例如：30"
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium">
                            阅读笔记（可选）
                          </label>
                          <textarea
                            value={readingForm.note}
                            onChange={(e) =>
                              setReadingForm({
                                ...readingForm,
                                note: e.target.value,
                              })
                            }
                            placeholder="记录您的阅读感受..."
                            rows={2}
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting ? "添加中..." : "添加阅读记录"}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold mb-4">写短评</h3>
                      <form onSubmit={handleAddReview} className="space-y-4">
                        <div className="space-y-2">
                          <label className="block text-sm font-medium">评分</label>
                          <select
                            value={reviewForm.rating}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, rating: e.target.value })
                            }
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50"
                          >
                            {[1, 2, 3, 4, 5].map((num) => (
                              <option key={num} value={num}>
                                {num} 星
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-2">
                          <label className="block text-sm font-medium">短评内容</label>
                          <textarea
                            value={reviewForm.content}
                            onChange={(e) =>
                              setReviewForm({ ...reviewForm, content: e.target.value })
                            }
                            placeholder="写下您的阅读感受..."
                            rows={4}
                            required
                            className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                          />
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                        >
                          {isSubmitting ? "提交中..." : "发布短评"}
                        </button>
                      </form>
                    </div>

                    <div>
                      <h3 className="font-semibold mb-4">
                        短评列表 ({book.reviews.length})
                      </h3>
                      {book.reviews.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">
                          暂无短评，快来写第一条吧！
                        </p>
                      ) : (
                        <div className="space-y-4">
                          {book.reviews.map((review: any) => (
                            <div
                              key={review.id}
                              className="p-4 bg-secondary/30 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-1">
                                  {Array.from({ length: parseInt(review.rating) }).map(
                                    (_, i) => (
                                      <span key={i}>⭐</span>
                                    )
                                  )}
                                </div>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(review.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm">{review.content}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "history" && (
                  <div>
                    <h3 className="font-semibold mb-4">
                      阅读历史 ({book.readingSessions.length})
                    </h3>
                    {book.readingSessions.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        暂无阅读记录，开始您的第一次阅读吧！
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {book.readingSessions.map((session: any) => (
                          <div
                            key={session.id}
                            className="p-4 bg-secondary/30 rounded-lg"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                {new Date(session.date).toLocaleDateString()}
                              </span>
                              <span className="text-sm text-muted-foreground">
                                {formatDuration(session.duration)}
                              </span>
                            </div>
                            <div className="text-sm text-muted-foreground mb-2">
                              第 {session.startPage} - {session.endPage} 页（共读了{" "}
                              {session.endPage - session.startPage + 1} 页）
                            </div>
                            {session.note && (
                              <p className="text-sm border-t border-border pt-2 mt-2">
                                {session.note}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">书籍管理</h3>
              <button
                onClick={handleDelete}
                className="w-full px-4 py-2.5 text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors text-sm font-medium"
              >
                删除这本书
              </button>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <h3 className="font-semibold mb-4">进度历史</h3>
              {book.progressHistory.length === 0 ? (
                <p className="text-muted-foreground text-sm">暂无进度记录</p>
              ) : (
                <div className="space-y-2">
                  {book.progressHistory.slice(0, 10).map((history: any) => (
                    <div
                      key={history.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-muted-foreground">
                        {new Date(history.date).toLocaleDateString()}
                      </span>
                      <span className="font-medium">{history.percentage}%</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
