import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ThemeToggle } from "@/components/theme-toggle";
import { UserBadge } from "@/components/user-badge";
import { DocumentPreview } from "@/components/document-preview";
import { SharePanel } from "@/components/share-panel";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/user";

export default async function DocumentDetail({
  params,
}: {
  params: { id: string };
}) {
  const userId = getCurrentUserId();
  const document = await prisma.document.findUnique({
    where: { id: params.id },
    include: {
      shares: {
        include: { history: { orderBy: { createdAt: "asc" } } },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!document) {
    notFound();
  }

  if (document.uploaderId && document.uploaderId !== userId) {
    if (document.isPublic) {
      const share = await prisma.share.findFirst({
        where: {
          documentId: document.id,
          isActive: true,
          accessType: "LINK_ONLY",
        },
      });
      if (share) {
        redirect(`/share/${share.token}`);
      }
    }
    notFound();
  }

  return (
    <main className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m12 19-7-7 7-7" />
              <path d="M19 12H5" />
            </svg>
            <span className="font-medium">返回</span>
          </Link>
          <div className="flex items-center gap-3">
            <UserBadge userId={userId} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <DocumentPreview document={document} />
          </div>
          <div className="space-y-6">
            <SharePanel
              documentId={document.id}
              shares={document.shares}
              isPublic={document.isPublic}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
