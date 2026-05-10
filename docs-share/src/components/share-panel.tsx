"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Share, ShareStatusHistory } from "@prisma/client";
import { cn } from "@/utils/cn";

type AccessType = "LINK_ONLY" | "PASSWORD";

type ShareWithHistory = Share & { history: ShareStatusHistory[] };

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function SharePanel({
  documentId,
  shares: initialShares,
  isPublic,
}: {
  documentId: string;
  shares: ShareWithHistory[];
  isPublic: boolean;
}) {
  const router = useRouter();
  const [shares, setShares] = useState<ShareWithHistory[]>(initialShares);
  const [isCreating, setIsCreating] = useState(false);
  const [accessType, setAccessType] = useState<AccessType>("LINK_ONLY");
  const [password, setPassword] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPublicState, setIsPublicState] = useState(isPublic);
  const [isUpdatingPublic, setIsUpdatingPublic] = useState(false);
  const [statusModalShare, setStatusModalShare] = useState<Share | null>(null);
  const [statusRemark, setStatusRemark] = useState("");
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [expandedHistory, setExpandedHistory] = useState<string | null>(null);

  const handleTogglePublic = async () => {
    setIsUpdatingPublic(true);
    setError(null);

    try {
      const res = await fetch(`/api/documents/${documentId}/settings`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic: !isPublicState }),
      });

      if (res.ok) {
        setIsPublicState(!isPublicState);
        router.refresh();
      } else {
        const err = await res.json();
        setError(err.message || "更新文档设置失败");
      }
    } catch (err) {
      setError("更新文档设置失败，请重试");
    } finally {
      setIsUpdatingPublic(false);
    }
  };

  const handleCreateShare = async () => {
    setIsCreating(true);
    setError(null);

    try {
      const res = await fetch("/api/shares", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId,
          accessType,
          password: password || undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
        }),
      });

      if (res.ok) {
        const newShare = await res.json();
        setShares([...shares, newShare]);
        setPassword("");
        setExpiresAt("");
        router.refresh();
      } else {
        const err = await res.json();
        setError(err.message || "创建分享链接失败");
      }
    } catch (err) {
      setError("创建分享链接失败，请重试");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopyLink = async (share: Share) => {
    const url = `${window.location.origin}/share/${share.token}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(share.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("复制失败", err);
    }
  };

  const handleToggleActive = (share: Share) => {
    setStatusModalShare(share);
    setStatusRemark("");
  };

  const handleConfirmStatusChange = async () => {
    if (!statusModalShare) return;

    setIsUpdatingStatus(true);
    setError(null);

    try {
      const res = await fetch(`/api/shares/${statusModalShare.token}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isActive: !statusModalShare.isActive,
          remark: statusRemark.trim() || undefined,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setShares(shares.map((s) => (s.id === statusModalShare.id ? updated : s)));
        setStatusModalShare(null);
        setStatusRemark("");
        router.refresh();
      } else {
        const err = await res.json();
        setError(err.message || "更新状态失败");
      }
    } catch (err) {
      setError("更新状态失败，请重试");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDelete = async (share: Share) => {
    if (!confirm("确定要删除这个分享链接吗？")) return;

    try {
      const res = await fetch(`/api/shares/${share.token}`, {
        method: "DELETE",
      });

      if (res.ok) {
        setShares(shares.filter((s) => s.id !== share.id));
        router.refresh();
      }
    } catch (err) {
      console.error("删除失败", err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
            <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          文档访问权限
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div className="flex-1">
              <p className="font-medium text-sm">
                {isPublicState ? "公开文档" : "私有文档"}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {isPublicState
                  ? "任何人都可以通过 /docs/[id] 访问此文档"
                  : "只有通过分享链接的人才能访问此文档"}
              </p>
            </div>
            <button
              onClick={handleTogglePublic}
              disabled={isUpdatingPublic}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none disabled:opacity-50",
                isPublicState ? "bg-primary" : "bg-muted-foreground/30"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
                  isPublicState ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-card p-5">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
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
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          创建分享链接
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">链接权限</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { value: "LINK_ONLY", label: "仅链接", desc: "知道链接即可访问" },
                { value: "PASSWORD", label: "密码保护", desc: "需要密码才能访问" },
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => setAccessType(option.value as AccessType)}
                  className={cn(
                    "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                    accessType === option.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-secondary hover:bg-accent border-transparent"
                  )}
                >
                  <div>{option.label}</div>
                  <div className={cn(
                    "text-xs mt-0.5",
                    accessType === option.value ? "text-primary-foreground/80" : "text-muted-foreground"
                  )}>
                    {option.desc}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {accessType === "PASSWORD" && (
            <div>
              <label className="block text-sm font-medium mb-2">访问密码</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="设置访问密码"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-2">
              有效期（可选）
            </label>
            <input
              type="datetime-local"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              {error}
            </div>
          )}

          <button
            onClick={handleCreateShare}
            disabled={isCreating}
            className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isCreating ? (
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
                创建中...
              </>
            ) : (
              <>
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
                生成分享链接
              </>
            )}
          </button>
        </div>
      </div>

      {shares.length > 0 && (
        <div className="rounded-xl border border-border bg-card">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold">现有的分享链接</h3>
          </div>
          <div className="divide-y divide-border">
            {shares.map((share) => (
              <div key={share.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded-full text-xs font-medium",
                        share.isActive
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                      )}
                    >
                      {share.isActive ? "活跃" : "已停用"}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {share.accessType === "LINK_ONLY" && "仅链接"}
                      {share.accessType === "PASSWORD" && "密码保护"}
                    </span>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    <span className="font-medium">创建时间：</span>
                    {formatDate(share.createdAt)}
                  </p>
                  <p>
                    <span className="font-medium">浏览次数：</span>
                    {share.viewCount}
                  </p>
                  {share.expiresAt && (
                    <p>
                      <span className="font-medium">过期时间：</span>
                      {formatDate(share.expiresAt)}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleCopyLink(share)}
                    className="flex-1 px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm font-medium flex items-center justify-center gap-2"
                  >
                    {copiedId === share.id ? (
                      <>
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
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                        已复制
                      </>
                    ) : (
                      <>
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
                          <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                          <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                        </svg>
                        复制链接
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => handleToggleActive(share)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg transition-colors text-sm font-medium",
                      share.isActive
                        ? "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 hover:bg-orange-200 dark:hover:bg-orange-900/50"
                        : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/50"
                    )}
                  >
                    {share.isActive ? "停用" : "启用"}
                  </button>
                  <button
                    onClick={() => handleDelete(share)}
                    className="px-3 py-1.5 rounded-lg bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors text-sm font-medium"
                  >
                    删除
                  </button>
                </div>

                {share.history && share.history.length > 0 && (
                  <div>
                    <button
                      onClick={() =>
                        setExpandedHistory(
                          expandedHistory === share.id ? null : share.id
                        )
                      }
                      className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
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
                        className={cn(
                          "transition-transform",
                          expandedHistory === share.id && "rotate-90"
                        )}
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                      状态变更历史（{share.history.length}）
                    </button>
                    {expandedHistory === share.id && (
                      <div className="mt-2 space-y-2 pl-5 border-l-2 border-muted">
                        {share.history
                          .slice()
                          .reverse()
                          .map((history) => (
                            <div
                              key={history.id}
                              className="relative py-2 pl-4"
                            >
                              <div className="absolute left-[-5px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-muted-foreground" />
                              <div className="flex items-center gap-2 mb-1">
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded text-xs font-medium",
                                    history.isActive
                                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                      : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                                  )}
                                >
                                  {history.isActive ? "启用" : "停用"}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {formatDate(history.createdAt)}
                                </span>
                              </div>
                              {history.remark && (
                                <p className="text-sm text-muted-foreground">
                                  备注：{history.remark}
                                </p>
                              )}
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {statusModalShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-card p-6">
            <h3 className="text-lg font-semibold mb-4">
              确认{statusModalShare.isActive ? "停用" : "启用"}分享链接
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              您确定要将此分享链接
              <span className="font-medium text-foreground">
                {statusModalShare.isActive ? " 停用 " : " 启用 "}
              </span>
              吗？
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                备注（可选）
              </label>
              <textarea
                value={statusRemark}
                onChange={(e) => setStatusRemark(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                rows={3}
                placeholder="请输入状态变更的原因或备注..."
                autoFocus
              />
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setStatusModalShare(null);
                  setError(null);
                }}
                disabled={isUpdatingStatus}
                className="px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm font-medium disabled:opacity-50"
              >
                取消
              </button>
              <button
                onClick={handleConfirmStatusChange}
                disabled={isUpdatingStatus}
                className={cn(
                  "px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-2 disabled:opacity-50",
                  statusModalShare.isActive
                    ? "bg-orange-500 text-white hover:bg-orange-600"
                    : "bg-green-500 text-white hover:bg-green-600"
                )}
              >
                {isUpdatingStatus ? (
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
                    处理中...
                  </>
                ) : (
                  `确认${statusModalShare.isActive ? "停用" : "启用"}`
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
