"use client";

import { Share, Document } from "@prisma/client";
import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/utils/cn";

type ShareWithDocument = Share & { document: Document };

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function getDocumentType(document: Document) {
  const isImage = document.type.startsWith("image/");
  const isPdf =
    document.type.includes("pdf") || document.originalName.endsWith(".pdf");
  const isDocx =
    document.originalName.endsWith(".docx") ||
    document.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
  const isDoc = document.originalName.endsWith(".doc");
  const isMarkdown =
    document.originalName.endsWith(".md") ||
    document.originalName.endsWith(".markdown");
  const isText =
    document.type.startsWith("text/") ||
    document.originalName.endsWith(".txt") ||
    document.originalName.endsWith(".json") ||
    document.originalName.endsWith(".js") ||
    document.originalName.endsWith(".ts") ||
    document.originalName.endsWith(".jsx") ||
    document.originalName.endsWith(".tsx") ||
    document.originalName.endsWith(".css") ||
    document.originalName.endsWith(".html");

  return { isImage, isPdf, isDocx, isDoc, isMarkdown, isText };
}

function LoadingSpinner() {
  return (
    <div className="text-center text-muted-foreground py-20">
      <svg
        className="animate-spin h-12 w-12 mx-auto mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <p className="text-lg">正在加载预览...</p>
    </div>
  );
}

function PreviewError({
  error,
  token,
  password,
}: {
  error: string;
  token: string;
  password: string;
}) {
  return (
    <div className="text-center py-20 text-muted-foreground">
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
        <circle cx="12" cy="12" r="10" />
        <line x1="12" x2="12" y1="8" y2="12" />
        <line x1="12" x2="12.01" y1="16" y2="16" />
      </svg>
      <p className="text-lg">{error}</p>
      <a
        href={`/api/shares/${token}/download?password=${encodeURIComponent(password)}`}
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        下载文件
      </a>
    </div>
  );
}

function UnsupportedPreview({
  token,
  password,
}: {
  token: string;
  password: string;
}) {
  return (
    <div className="text-center py-20 text-muted-foreground">
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
      <p className="text-lg">此文件类型不支持在线预览</p>
      <a
        href={`/api/shares/${token}/download?password=${encodeURIComponent(password)}`}
        className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" x2="12" y1="15" y2="3" />
        </svg>
        下载文件
      </a>
    </div>
  );
}

function ImagePreview({
  document,
  previewUrl,
}: {
  document: Document;
  previewUrl: string;
}) {
  return (
    <div className="flex items-center justify-center bg-muted/30 min-h-[400px] p-4">
      <img
        src={previewUrl}
        alt={document.originalName}
        className="max-w-full max-h-[800px] object-contain rounded-lg shadow-lg"
      />
    </div>
  );
}

function PdfPreview({
  document,
  previewUrl,
  token,
  password,
}: {
  document: Document;
  previewUrl: string;
  token: string;
  password: string;
}) {
  return (
    <div className="bg-muted/30">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
        <span className="text-sm font-medium">PDF 预览</span>
        <a
          href={`/api/shares/${token}/download?password=${encodeURIComponent(password)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          下载
        </a>
      </div>
      <div className="min-h-[600px]">
        <iframe
          src={previewUrl}
          className="w-full h-[600px] border-0"
          title={`PDF Preview: ${document.originalName}`}
        />
      </div>
    </div>
  );
}

function MarkdownPreview({
  document,
  content,
  token,
  password,
}: {
  document: Document;
  content: string;
  token: string;
  password: string;
}) {
  return (
    <div className="bg-background">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-10">
        <span className="text-sm font-medium">Markdown 预览</span>
        <a
          href={`/api/shares/${token}/download?password=${encodeURIComponent(password)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          下载
        </a>
      </div>
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <article
          className={cn(
            "prose prose-slate dark:prose-invert max-w-none",
            "prose-headings:scroll-m-20",
            "prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mt-8 prose-h1:first:mt-0",
            "prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-6",
            "prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-4",
            "prose-p:leading-7 prose-p:my-4",
            "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
            "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:pr-4",
            "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:shadow-sm",
            "prose-ul:my-4 prose-ul:space-y-1",
            "prose-ol:my-4 prose-ol:space-y-1",
            "prose-hr:my-8 prose-hr:border-border",
            "prose-table:border prose-hr:border-border prose-table:rounded-lg prose-table:overflow-hidden",
            "prose-th:bg-muted prose-th:font-semibold",
            "prose-td:border-t prose-td:border-border"
          )}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </article>
      </div>
    </div>
  );
}

function DocxPreview({
  document,
  htmlContent,
  token,
  password,
}: {
  document: Document;
  htmlContent: string;
  token: string;
  password: string;
}) {
  return (
    <div className="bg-background">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-10">
        <span className="text-sm font-medium">Word 文档预览</span>
        <a
          href={`/api/shares/${token}/download?password=${encodeURIComponent(password)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          下载
        </a>
      </div>
      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <div
          className={cn(
            "prose prose-slate dark:prose-invert max-w-none",
            "prose-headings:scroll-m-20",
            "prose-h1:text-3xl prose-h1:font-bold prose-h1:tracking-tight prose-h1:mt-8 prose-h1:first:mt-0",
            "prose-h2:text-2xl prose-h2:font-semibold prose-h2:tracking-tight prose-h2:mt-6",
            "prose-h3:text-xl prose-h3:font-semibold prose-h3:tracking-tight prose-h3:mt-4",
            "prose-p:leading-7 prose-p:my-4",
            "prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline",
            "prose-blockquote:border-l-primary prose-blockquote:bg-muted/50 prose-blockquote:rounded-r-lg prose-blockquote:py-2 prose-blockquote:pr-4",
            "prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:before:content-none prose-code:after:content-none",
            "prose-pre:bg-muted prose-pre:rounded-lg prose-pre:border prose-pre:border-border prose-pre:shadow-sm",
            "prose-ul:my-4 prose-ul:space-y-1",
            "prose-ol:my-4 prose-ol:space-y-1",
            "prose-hr:my-8 prose-hr:border-border",
            "prose-table:border prose-hr:border-border prose-table:rounded-lg prose-table:overflow-hidden",
            "prose-th:bg-muted prose-th:font-semibold",
            "prose-td:border-t prose-td:border-border"
          )}
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />
      </div>
    </div>
  );
}

function TextPreview({
  document,
  content,
  token,
  password,
}: {
  document: Document;
  content: string;
  token: string;
  password: string;
}) {
  return (
    <div className="bg-background">
      <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border sticky top-0 z-10">
        <span className="text-sm font-medium">文本预览</span>
        <a
          href={`/api/shares/${token}/download?password=${encodeURIComponent(password)}`}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          下载
        </a>
      </div>
      <div className="p-4 md:p-6">
        <pre className="bg-muted p-4 rounded-lg overflow-auto text-sm font-mono leading-relaxed whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </div>
  );
}

export function SharePreview({ share }: { share: ShareWithDocument }) {
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(
    share.accessType !== "PASSWORD"
  );
  const [authError, setAuthError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [htmlContent, setHtmlContent] = useState<string>("");
  const [textContent, setTextContent] = useState<string>("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { isImage, isPdf, isDocx, isDoc, isMarkdown, isText } =
    getDocumentType(share.document);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    setAuthError(null);

    try {
      const res = await fetch(`/api/shares/${share.token}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        setIsAuthenticated(true);
      } else {
        const data = await res.json();
        setAuthError(data.message || "密码错误");
      }
    } catch (err) {
      setAuthError("验证失败，请重试");
    } finally {
      setIsVerifying(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const loadPreview = async () => {
      setLoading(true);
      setPreviewError(null);

      try {
        if (isDocx) {
          const res = await fetch(
            `/api/shares/${share.token}/preview?format=html&password=${encodeURIComponent(password)}`
          );
          if (res.ok) {
            const data = await res.json();
            setHtmlContent(data.html);
          } else {
            setPreviewError("无法加载 Word 文档预览");
          }
        } else if (isMarkdown || isText) {
          const res = await fetch(
            `/api/shares/${share.token}/preview?format=text&password=${encodeURIComponent(password)}`
          );
          if (res.ok) {
            const data = await res.json();
            setTextContent(data.text);
          } else {
            setPreviewError("无法加载文本预览");
          }
        } else if (isImage || isPdf) {
          const res = await fetch(
            `/api/shares/${share.token}/preview?password=${encodeURIComponent(password)}`
          );
          if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setPreviewUrl(url);
          } else {
            setPreviewError("无法加载预览");
          }
        }
      } catch (err) {
        setPreviewError("加载失败，请重试");
      } finally {
        setLoading(false);
      }
    };

    loadPreview();

    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [share.token, password, isAuthenticated, isImage, isPdf, isDocx, isMarkdown, isText]);

  if (!isAuthenticated) {
    return (
      <main className="min-h-screen flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-xl border border-border bg-card">
          <div className="text-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-4 text-primary"
            >
              <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            <h1 className="text-2xl font-bold">需要密码</h1>
            <p className="text-muted-foreground mt-1">
              请输入密码以访问此文档
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="输入密码"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={isVerifying || !password}
              className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isVerifying ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  验证中...
                </>
              ) : (
                "验证密码"
              )}
            </button>
          </form>
        </div>
      </main>
    );
  }

  let previewContent = null;

  if (loading) {
    previewContent = <LoadingSpinner />;
  } else if (previewError) {
    previewContent = (
      <PreviewError
        error={previewError}
        token={share.token}
        password={password}
      />
    );
  } else if (isImage && previewUrl) {
    previewContent = (
      <ImagePreview document={share.document} previewUrl={previewUrl} />
    );
  } else if (isPdf && previewUrl) {
    previewContent = (
      <PdfPreview
        document={share.document}
        previewUrl={previewUrl}
        token={share.token}
        password={password}
      />
    );
  } else if (isDocx && htmlContent) {
    previewContent = (
      <DocxPreview
        document={share.document}
        htmlContent={htmlContent}
        token={share.token}
        password={password}
      />
    );
  } else if (isMarkdown && textContent) {
    previewContent = (
      <MarkdownPreview
        document={share.document}
        content={textContent}
        token={share.token}
        password={password}
      />
    );
  } else if (isText && textContent) {
    previewContent = (
      <TextPreview
        document={share.document}
        content={textContent}
        token={share.token}
        password={password}
      />
    );
  } else if (isDoc) {
    previewContent = (
      <div className="text-center py-20 text-muted-foreground">
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
        <p className="text-lg">.doc 文件格式不支持在线预览</p>
        <a
          href={`/api/shares/${share.token}/download?password=${encodeURIComponent(password)}`}
          className="inline-flex items-center gap-2 mt-6 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" x2="12" y1="15" y2="3" />
          </svg>
          下载文件
        </a>
      </div>
    );
  } else {
    previewContent = (
      <UnsupportedPreview token={share.token} password={password} />
    );
  }

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
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold break-words">
              {share.document.originalName}
            </h1>
            <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
              <span>{formatFileSize(share.document.size)}</span>
              <span>·</span>
              <span className="uppercase">
                {share.document.type.split("/")[1] || "文件"}
              </span>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
            {previewContent}
          </div>
        </div>
      </div>
    </main>
  );
}
