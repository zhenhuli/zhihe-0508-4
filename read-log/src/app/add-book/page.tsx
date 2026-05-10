"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

export default function AddBookPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_PAGES = 100000;
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<{ totalPages?: string }>({});
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    totalPages: "",
    genre: "",
    description: "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!allowedTypes.includes(file.type)) {
      alert("只支持 JPG、PNG、WebP、GIF 格式的图片");
      return;
    }

    setIsUploading(true);
    setCoverPreview(URL.createObjectURL(file));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/cover", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setCoverImage(data.url);
      } else {
        alert(data.message || "上传失败");
        setCoverPreview(null);
      }
    } catch (error) {
      console.error("上传失败:", error);
      alert("上传失败，请重试");
      setCoverPreview(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setCoverImage(null);
    setCoverPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const totalPagesNum = parseInt(formData.totalPages);
    if (isNaN(totalPagesNum) || totalPagesNum < 1) {
      setFormErrors({ totalPages: "请输入有效的页数" });
      return;
    }
    if (totalPagesNum > MAX_PAGES) {
      setFormErrors({
        totalPages: `页数不能超过 ${MAX_PAGES.toLocaleString()}`,
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          coverImage,
        }),
      });

      if (response.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await response.json();
        alert(data.message || "添加书籍失败");
      }
    } catch (error) {
      console.error("添加书籍失败:", error);
      alert("添加书籍失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Header />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">添加新书籍</h1>
          <p className="text-muted-foreground">
            填写书籍信息，开始记录您的阅读之旅
          </p>
        </div>

        <div className="bg-white rounded-xl border border-border p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium">封面图片</label>
              <div className="flex items-start gap-4">
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="封面预览"
                      className="w-32 h-44 object-cover rounded-lg border border-border"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="w-32 h-44 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <span className="text-3xl mb-2">📷</span>
                    <span className="text-xs text-muted-foreground">
                      点击上传
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <p className="text-sm text-muted-foreground mb-2">
                    支持 JPG、PNG、WebP、GIF 格式，最大 10MB
                  </p>
                  {isUploading && (
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                      上传中...
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">书名 *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="例如：活着"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">作者 *</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) =>
                  setFormData({ ...formData, author: e.target.value })
                }
                placeholder="例如：余华"
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-medium">总页数 *</label>
                <input
                  type="number"
                  value={formData.totalPages}
                  onChange={(e) => {
                    const value = e.target.value;
                    setFormData({ ...formData, totalPages: value });
                    const numValue = parseInt(value);
                    if (value && (isNaN(numValue) || numValue > MAX_PAGES)) {
                      setFormErrors({
                        ...formErrors,
                        totalPages: `页数不能超过 ${MAX_PAGES.toLocaleString()}`,
                      });
                    } else {
                      const newErrors = { ...formErrors };
                      delete newErrors.totalPages;
                      setFormErrors(newErrors);
                    }
                  }}
                  placeholder="例如：300"
                  min="1"
                  max={MAX_PAGES}
                  className={`w-full px-4 py-2.5 rounded-lg border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 transition-colors ${
                    formErrors.totalPages
                      ? "border-red-500 focus:border-red-500"
                      : "border-border focus:border-primary"
                  }`}
                  required
                />
                {formErrors.totalPages && (
                  <p className="text-sm text-red-500">{formErrors.totalPages}</p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium">分类</label>
                <select
                  value={formData.genre}
                  onChange={(e) =>
                    setFormData({ ...formData, genre: e.target.value })
                  }
                  className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors"
                >
                  <option value="">选择分类</option>
                  <option value="小说">小说</option>
                  <option value="文学">文学</option>
                  <option value="历史">历史</option>
                  <option value="哲学">哲学</option>
                  <option value="心理学">心理学</option>
                  <option value="商业">商业</option>
                  <option value="科技">科技</option>
                  <option value="传记">传记</option>
                  <option value="其他">其他</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium">简介</label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder="这本书是关于什么的？"
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-colors resize-none"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border bg-secondary hover:bg-accent transition-colors font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-primary text-white hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isLoading ? "添加中..." : "添加书籍"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
