// components/UrlForm.tsx
"use client";

import { useState } from "react";

export default function UrlForm() {
  // Shortener States
  const [url, setUrl] = useState("");
  const [ttl, setTtl] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ shortUrl: string; slug: string } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // Analytics States
  const [inspectSlug, setInspectSlug] = useState("");
  const [stats, setStats] = useState<{ originalUrl: string; clicks: number } | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");

  const handleShorten = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResult(null);
    setCopied(false);

    try {
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url,
          ttlSeconds: ttl ? parseInt(ttl) : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setResult(data);
      setUrl("");
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInspect = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatsLoading(true);
    setStatsError("");
    setStats(null);

    // Extract slug if user pastes a full short URL
    const cleanSlug = inspectSlug.split("/").pop() || inspectSlug;

    try {
      const res = await fetch(`/api/stats?slug=${cleanSlug}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setStats(data);
    } catch (err: any) {
      setStatsError(err.message || "Could not fetch stats");
    } finally {
      setStatsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto space-y-8">
      {/* Shortener Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">🔗 Create Short Link</h2>
        <form onSubmit={handleShorten} className="space-y-4">
          <div>
            <input
              type="text"
              required
              placeholder="https://your-long-url.com/path/to/resource"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <select
                value={ttl}
                onChange={(e) => setTtl(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white focus:outline-none focus:border-blue-500 transition"
              >
                <option value="">No Expiry (Permanent)</option>
                <option value="60">Expire in 1 Minute (Test)</option>
                <option value="3600">Expire in 1 Hour</option>
                <option value="86400">Expire in 24 Hours</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-6 py-3 rounded-lg transition disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>
        </form>

        {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

        {result && (
          <div className="mt-6 p-4 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-between gap-4">
            <div className="truncate">
              <p className="text-xs text-slate-400">Short URL:</p>
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-400 font-mono hover:underline truncate block"
              >
                {result.shortUrl}
              </a>
            </div>
            <button
              onClick={() => copyToClipboard(result.shortUrl)}
              className="bg-slate-700 hover:bg-slate-600 text-white text-sm px-4 py-2 rounded transition shrink-0"
            >
              {copied ? "Copied! ✓" : "Copy"}
            </button>
          </div>
        )}
      </div>

      {/* Analytics Card */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold text-white mb-4">📊 Track Clicks</h2>
        <form onSubmit={handleInspect} className="flex gap-4">
          <input
            type="text"
            required
            placeholder="Enter short ID (e.g. abc123)"
            value={inspectSlug}
            onChange={(e) => setInspectSlug(e.target.value)}
            className="flex-1 px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition"
          />
          <button
            type="submit"
            disabled={statsLoading}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-medium px-6 py-3 rounded-lg transition disabled:opacity-50"
          >
            {statsLoading ? "Searching..." : "Inspect"}
          </button>
        </form>

        {statsError && <p className="text-red-400 text-sm mt-4">{statsError}</p>}

        {stats && (
          <div className="mt-6 space-y-2 text-slate-300 border-t border-slate-800 pt-4">
            <div className="flex justify-between items-center">
              <span className="text-slate-400 text-sm">Total Clicks:</span>
              <span className="text-2xl font-bold text-emerald-400">{stats.clicks}</span>
            </div>
            <div>
              <span className="text-slate-400 text-sm block">Redirects to:</span>
              <span className="text-sm font-mono text-slate-300 break-all">{stats.originalUrl}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}