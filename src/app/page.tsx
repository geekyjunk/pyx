"use client";
/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";

function sanitizeNumber(value: string): string {
  return value.trim().replace(/[^\d]/g, "");
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [quality, setQuality] = useState("");
  const [format, setFormat] = useState("webp");

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const optimizedQuery = useMemo(() => {
    const params = new URLSearchParams();
    if (width) params.set("w", width);
    if (height) params.set("h", height);
    if (quality) params.set("q", quality);
    if (format) params.set("f", format);
    return params.toString();
  }, [width, height, quality, format]);

  return (
    <main className="min-h-screen bg-zinc-50 px-4 py-8 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <div className="mx-auto w-full max-w-xl space-y-5 rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h1 className="text-lg font-semibold">Image Optimizer UI</h1>

        <label className="block">
          <span className="mb-1 block text-sm font-medium">Image</span>
          <input
            type="file"
            accept="image/*"
            className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
            onChange={(e) => {
              const file = e.target.files?.[0] ?? null;
              if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
              }
              if (!file) {
                setSelectedFile(null);
                setPreviewUrl("");
                return;
              }
              const objectUrl = URL.createObjectURL(file);
              setSelectedFile(file);
              setPreviewUrl(objectUrl);
            }}
          />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Width</span>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              inputMode="numeric"
              placeholder="1200"
              value={width}
              onChange={(e) => setWidth(sanitizeNumber(e.target.value))}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Height</span>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              inputMode="numeric"
              placeholder="630"
              value={height}
              onChange={(e) => setHeight(sanitizeNumber(e.target.value))}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Quality</span>
            <input
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              inputMode="numeric"
              placeholder="80"
              value={quality}
              onChange={(e) => setQuality(sanitizeNumber(e.target.value))}
            />
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Format</span>
            <select
              className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-800"
              value={format}
              onChange={(e) => setFormat(e.target.value)}
            >
              <option value="webp">webp</option>
              <option value="avif">avif</option>
              <option value="jpeg">jpeg</option>
              <option value="png">png</option>
            </select>
          </label>
        </div>

        <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-3 dark:border-zinc-800 dark:bg-zinc-950">
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Optimized query</p>
          <code className="block break-all text-sm">{optimizedQuery ? `?${optimizedQuery}` : "-"}</code>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-950">
          {previewUrl ? (
            <img src={previewUrl} alt={selectedFile?.name ?? "Selected image"} className="h-auto w-full" />
          ) : (
            <div className="grid min-h-56 place-items-center p-6 text-sm text-zinc-500">No image selected</div>
          )}
        </div>
      </div>
    </main>
  );
}
