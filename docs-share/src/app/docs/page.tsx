import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocumentList } from "@/components/document-list";
import { UserBadge } from "@/components/user-badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

export default async function DocumentsPage() {
  const userId = getCurrentUserId();

  const documents = userId
    ? await prisma.document.findMany({
        where: { uploaderId: userId },
        orderBy: { createdAt: "desc" },
        include: { shares: true },
      })
    : [];

  return (
    <main className="min-h-screen">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-primary"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 18v-6" />
              <path d="m9 15 3 3 3-3" />
            </svg>
            <h1 className="text-xl font-bold">Docs Share</h1>
          </Link>
          <div className="flex items-center gap-3">
            <UserBadge userId={userId} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold">我的文档</h2>
            <p className="text-muted-foreground mt-1">
              共 {documents.length} 个文档
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            上传文档
          </Link>
        </div>

        {documents.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 opacity-50"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <p className="text-lg font-medium">还没有文档</p>
            <p className="mt-1">上传您的第一个文档开始分享吧</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              开始上传
            </Link>
          </div>
        ) : (
          <DocumentList initialDocuments={documents} />
        )}
      </section>
    </main>
  );
}
