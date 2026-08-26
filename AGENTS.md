# Repository instructions

- This is a sanitized, static public demo of the ArcVelocity homepage. Preserve the deny-by-default rules in `PUBLIC-SCOPE.md`.
- Never add production routes beyond the homepage, integrations, private identifiers, data, credentials, environment files, operational documentation, or history from another repository. Media is allowed only after explicit authorization, metadata cleaning, ownership documentation, and inclusion in `public/asset-manifest.json`.
- Before changing Next.js code, read the relevant installed documentation in `node_modules/next/dist/docs/`.
- Required verification is `npm run safety`, `npm run lint`, `npm run build`, and `npm audit`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
