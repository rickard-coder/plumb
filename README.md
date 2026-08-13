# PLUMB

Landing page for **PLUMB** — AI project management and optimization.

Static HTML + Tailwind CDN. Hosted on Cloudflare Pages.

## Local

Open `index.html` in a browser, or:

```bash
npx wrangler pages dev .
```

## Deploy

Pushes to `main` deploy automatically via the Cloudflare Pages GitHub integration.

Manual deploy:

```bash
npx wrangler pages deploy . --project-name=plumb
```

## Pages settings

| Setting | Value |
| --- | --- |
| Production branch | `main` |
| Build command | _(none)_ |
| Build output directory | `/` |
