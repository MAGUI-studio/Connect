<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Professional Landing Page Template - Agent Rules

You are working on a high-performance, enterprise-grade Next.js template. Follow these rules strictly:

## 1. Engineering Guardrails

- **Git Hygiene:** Husky and Commitlint are active. Use conventional commits (e.g., `feat:`, `fix:`, `chore:`).
- **Pre-commit:** `lint-staged` runs Prettier and ESLint on every commit. Do not bypass this.
- **CI/CD:** Every PR triggers Vitest, Cypress, Build, and Lighthouse CI (scores must be > 90%).
- **A11y:** The project follows WCAG 2.1 AA standards. Always run `pnpm run audit:a11y` when creating new layouts.

## 2. Performance Standards

- **Partytown:** All third-party scripts (GA, Pixel) MUST use `type="text/partytown"`. Never add heavy scripts to the main thread.
- **Bundle Size:** Be careful with imports. Use the `pnpm run analyze` command if you suspect a library is too heavy.
- **Web Vitals:** Monitor metrics via the `WebVitals` component. Performance is a feature.

## 3. SEO & Metadata

- **JSON-LD:** Use the `JsonLd` component from `src/utils/json-ld.tsx` for structured data.
- **Sitemap:** Automatically generated on `postbuild`. Ensure `next-sitemap.config.js` is updated if new dynamic routes are added.
- **Metadata:** Use Next.js native Metadata API in `layout.tsx` or `page.tsx`.

## 4. Architecture

- **Directory Structure:**
  - `src/components`: UI-agnostic components.
  - `src/hooks`: Custom React hooks.
  - `src/services`: Data fetching and API logic.
  - `src/utils`: Helper functions (e.g., `cache.ts` for purging).
  - `app/`: Next.js App Router (Server Components by default).
- **Styling:** Tailwind CSS v4. Use semantic tokens (e.g., `text-primary`, `bg-background`).

## 5. Security

- **CSP:** Strict Content Security Policy is active in `next.config.ts`. If you add a new external domain, you MUST update the `cspHeader` in `next.config.ts`.
- **Stand-alone:** The project is optimized for Docker via `output: "standalone"`.

## 6. Commands to Remember

- `pnpm dev`: Development mode.
- `pnpm changeset`: Create a new versioning changeset (required for new features).
- `pnpm test`: Run unit tests.
- `pnpm cypress:run`: Run E2E tests.
- `pnpm run partytown`: Sync Partytown library files to `public/`.
