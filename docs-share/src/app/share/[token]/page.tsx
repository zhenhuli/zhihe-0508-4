import { notFound } from "next/navigation";
import { SharePreview } from "@/components/share-preview";
import { prisma } from "@/lib/prisma";

export default async function SharePage({
  params,
}: {
  params: { token: string };
}) {
  const share = await prisma.share.findUnique({
    where: { token: params.token },
    include: { document: true },
  });

  if (!share) {
    notFound();
  }

  if (!share.isActive) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-xl border border-border bg-card">
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
            className="mx-auto mb-4 text-destructive opacity-50"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m8.5 8.5 7 7" />
            <path d="m15.5 8.5-7 7" />
          </svg>
          <h1 className="text-2xl font-bold mb-2">链接已失效</h1>
          <p className="text-muted-foreground">
            这个分享链接已被停用或已过期。
          </p>
        </div>
      </main>
    );
  }

  if (share.expiresAt && new Date(share.expiresAt) < new Date()) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center p-8 rounded-xl border border-border bg-card">
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
            className="mx-auto mb-4 text-destructive opacity-50"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" />
            <path d="m8.5 8.5 7 7" />
            <path d="m15.5 8.5-7 7" />
          </svg>
          <h1 className="text-2xl font-bold mb-2">链接已过期</h1>
          <p className="text-muted-foreground">
            这个分享链接已超过有效期。
          </p>
        </div>
      </main>
    );
  }

  return <SharePreview share={share} />;
}
