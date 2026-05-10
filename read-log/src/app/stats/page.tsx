"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import { formatDuration } from "@/lib/utils";

export default function StatsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error("获取统计数据失败:", error);
    } finally {
      setLoading(false);
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

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold mb-2">阅读统计</h1>
          <p className="text-muted-foreground">
            查看您的阅读数据和成就
          </p>
        </div>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">概览</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              icon="📚"
              label="全部书籍"
              value={stats?.totalBooks || 0}
              color="bg-purple-100"
            />
            <StatsCard
              icon="📖"
              label="正在阅读"
              value={stats?.readingBooks || 0}
              color="bg-green-100"
            />
            <StatsCard
              icon="✅"
              label="已完成"
              value={stats?.completedBooks || 0}
              color="bg-blue-100"
            />
            <StatsCard
              icon="⏸️"
              label="已暂停"
              value={stats?.pausedBooks || 0}
              color="bg-yellow-100"
            />
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-4">阅读时长</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="text-4xl mb-3">⏱️</div>
              <div className="text-3xl font-bold mb-1">
                {stats?.totalReadingHours || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                总阅读时长（小时）
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                约 {stats?.totalReadingMinutes || 0} 分钟
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <div className="text-4xl mb-3">📄</div>
              <div className="text-3xl font-bold mb-1">
                {stats?.totalPagesRead || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                总阅读页数
              </div>
            </div>

            <div className="bg-white rounded-xl border border-border p-6">
              <div className="text-4xl mb-3">📊</div>
              <div className="text-3xl font-bold mb-1">
                {stats?.averageMinutesPerSession || 0}
              </div>
              <div className="text-sm text-muted-foreground">
                平均每次阅读（分钟）
              </div>
            </div>
          </div>
        </section>

        {stats?.genreStats && Object.keys(stats.genreStats).length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-4">分类统计</h2>
            <div className="bg-white rounded-xl border border-border p-6">
              <div className="space-y-4">
                {Object.entries(stats.genreStats as Record<string, number>).map(
                  ([genre, count]) => (
                    <div key={genre} className="flex items-center gap-4">
                      <div className="w-24 text-sm font-medium">{genre}</div>
                      <div className="flex-1">
                        <div className="h-6 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(
                                (count / (stats?.totalBooks || 1)) * 100,
                                100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                      <div className="w-16 text-right text-sm font-medium">
                        {count} 本
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          </section>
        )}

        {stats?.totalBooks === 0 && (
          <div className="bg-white rounded-xl border border-border p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-xl font-semibold mb-2">暂无数据</h3>
            <p className="text-muted-foreground">
              添加第一本书，开始记录您的阅读之旅吧！
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
