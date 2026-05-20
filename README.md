# 🔗 URL Shortener

A high-performance, serverless URL shortener designed to convert long links into manageable, shareable URLs. Built with Next.js 16 and backed by Upstash Redis, this application leverages edge-ready architecture for instantaneous redirects, built-in analytics, and minimal latency.

## 🚀 Features

- **Lightning-Fast Redirects:** Powered by Upstash Redis for sub-millisecond data retrieval.
- **Click Analytics:** Real-time tracking of link usage and engagement statistics.
- **Ephemeral Links (TTL):** Optional Time-To-Live support to create links that automatically expire.
- **API Rate Limiting:** Built-in protection against abuse and DDoS using `@upstash/ratelimit` (sliding window limit).
- **Collision-Resistant IDs:** Secure and URL-friendly 6-character short links generated via `nanoid`.
- **Modern UI/UX:** Styled efficiently with the latest Tailwind CSS v4.
- **Type-Safe:** End-to-end type safety with TypeScript and React 19.

## 🛠️ Architecture & Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Library:** [React 19](https://react.dev/)
- **Database:** [Upstash Redis](https://upstash.com/redis) (Serverless KV)
- **Rate Limiting:** Upstash Ratelimit
- **Styling:** Tailwind CSS v4
- **ID Generation:** Nanoid

## ⚙️ Getting Started

Follow these steps to set up the project locally.

### Clone the repository

```bash
git clone https://github.com/ysumit99/url-shortener.git
cd url-shortener
```

### Install dependencies

```bash
npm install
```

### Set up Environment Variables

Create a `.env.local` file in the root directory and add your Upstash Redis credentials. You can get these by creating a free database on the [Upstash Console](https://console.upstash.com/).

```env
UPSTASH_REDIS_REST_URL="your_upstash_redis_url_here"
UPSTASH_REDIS_REST_TOKEN="your_upstash_redis_token_here"

# Optional: App URL for generating absolute short links
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📖 API Reference

### 1. Create a Short Link

Generates a short URL. Includes rate limiting (5 requests per 10 seconds per IP).

```http
POST /api/shorten
```

**Body Parameters:**

| Parameter    | Type     | Description                                                       |
| :----------- | :------- | :---------------------------------------------------------------- |
| `url`        | `string` | **Required**. The original URL to shorten (must include http/https) |
| `ttlSeconds` | `number` | **Optional**. Time-to-live in seconds before the link expires     |

**Response:**
Returns `201 Created` on success, `400 Bad Request` for invalid URLs, and `429 Too Many Requests` if rate limited.

### 2. Get Link Statistics

Retrieves the original URL and total click count for a given short link.

```http
GET /api/stats?slug={slug}
```

**Query Parameters:**

| Parameter | Type     | Description                                      |
| :-------- | :------- | :----------------------------------------------- |
| `slug`    | `string` | **Required**. The 6-character identifier of the link |

**Response:**
Returns `200 OK` with the slug, original URL, and click count. Returns `404 Not Found` if the link does not exist or has expired.

### 3. Debug Database (Development Only)

Provides a snapshot of the Redis database keys and sample values. 
*Note: This route has a fail-safe and will return a `404` when `NODE_ENV === 'production'`.*

```http
GET /api/debug
```

## 🚀 Deployment

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new). Since Upstash Redis is serverless, it pairs perfectly with Vercel's Edge and Serverless functions. Check out the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

_Designed and engineered by [Sumit Yadav](https://ysumit99.github.io/) · [Blog](https://sumityadav-dev.vercel.app) · [LinkedIn](https://www.linkedin.com/in/sumityadav-dev/) · [GitHub](https://github.com/ysumit99/) © 2026_
