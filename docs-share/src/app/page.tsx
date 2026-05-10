import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { DocumentUpload } from "@/components/document-upload";
import { DocumentList } from "@/components/document-list";
import { UserBadge } from "@/components/user-badge";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

export default async function Home() {
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
          <div className="flex items-center gap-2">
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
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/docs"
              className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm font-medium"
            >
              我的文档
            </Link>
            <UserBadge userId={userId} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-12 md:py-20">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 leading-tight">
            轻松分享您的
            <span className="text-primary">文档</span>
          </h2>
          <p className="text-muted-foreground text-lg md:text-xl">
            上传文档、生成分享链接、设置灵活的查看权限。
            简单、安全、高效的文档协作预览平台。
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-16">
          <DocumentUpload />
        </div>
      </section>

      {documents.length > 0 && (
        <section className="container mx-auto px-4 py-8">
          <h3 className="text-2xl font-bold mb-6">最近上传</h3>
          <DocumentList initialDocuments={documents} />
        </section>
      )}

      <footer className="border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm">
          <p>Docs Share - 在线文档协作预览工具</p>
        </div>
      </footer>
    </main>
  );
}
