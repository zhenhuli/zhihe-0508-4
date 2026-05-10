"use client";

import { useState } from "react";
import { cn } from "@/utils/cn";

function generateColor(userId: string): string {
  const colors = [
    "from-blue-500 to-blue-600",
    "from-purple-500 to-purple-600",
    "from-pink-500 to-pink-600",
    "from-indigo-500 to-indigo-600",
    "from-teal-500 to-teal-600",
    "from-orange-500 to-orange-600",
    "from-green-500 to-green-600",
    "from-red-500 to-red-600",
  ];

  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = userId.charCodeAt(i) + ((hash << 5) - hash);
  }

  return colors[Math.abs(hash) % colors.length];
}

export function UserBadge({ userId }: { userId?: string }) {
  const [showMenu, setShowMenu] = useState(false);

  if (!userId) {
    return null;
  }

  const shortId = userId.substring(0, 4);
  const gradient = generateColor(userId);

  const handleResetIdentity = () => {
    if (confirm("确定要重置您的身份吗？这将清除您当前的用户识别，刷新页面后将获得新的身份。")) {
      document.cookie =
        "docs_share_user_id=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.reload();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary hover:bg-accent transition-colors"
      >
        <div
          className={cn(
            "w-6 h-6 rounded-full bg-gradient-to-br flex items-center justify-center text-white text-xs font-bold",
            gradient
          )}
        >
          {shortId}
        </div>
        <span className="hidden md:inline text-sm font-medium">
          用户 {shortId}
        </span>
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
          className={cn("transition-transform", showMenu && "rotate-180")}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-border bg-card shadow-lg z-50 overflow-hidden">
            <div className="p-4 border-b border-border">
              <p className="text-sm font-medium">用户身份</p>
              <p className="text-xs text-muted-foreground mt-1 font-mono break-all">
                {userId}
              </p>
            </div>
            <div className="p-2">
              <button
                onClick={handleResetIdentity}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm"
              >
                <div className="flex items-center gap-2">
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
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" x2="9" y1="12" y2="12" />
                  </svg>
                  切换身份
                </div>
                <p className="text-xs text-muted-foreground mt-1 pl-6">
                  重置并获取新的用户 ID
                </p>
              </button>
            </div>
            <div className="p-4 bg-muted/30 border-t border-border">
              <p className="text-xs text-muted-foreground">
                您的身份存储在浏览器 Cookie 中，用于识别您上传的文档。
                不同浏览器或设备会有不同的身份。
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
