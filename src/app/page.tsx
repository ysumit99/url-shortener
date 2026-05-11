// app/page.tsx
import UrlForm from "@/components/UrlForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-3xl w-full text-center space-y-4 mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <span>AP Architecture</span>
          <span>•</span>
          <span>Upstash Redis</span>
          <span>•</span>
          <span>O(1) Lookups</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
          System Design URL Shortener
        </h1>
        
        <p className="text-slate-400 max-w-xl mx-auto text-sm md:text-base">
          Built to demonstrate high availability, key distribution caching, and low-latency edge redirects using Next.js and Serverless Redis.
        </p>
      </div>

      <UrlForm />
    </main>
  );
}