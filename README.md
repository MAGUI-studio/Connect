# Next.js Landing Page Template

A production-ready template for building modern, responsive, and accessible landing pages, marketing sites, and waitlists.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router, Server Components)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [Shadcn UI](https://ui.shadcn.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Typography:** Geist & Geist Mono

## Features

- 🚀 **Lightning Fast:** Built on the latest Next.js 16 for optimal performance.
- 🎨 **Beautiful UI:** Premium, customizable components from Shadcn UI.
- ✨ **Smooth Animations:** Integrated with Framer Motion for elegant page transitions and scroll effects.
- 📱 **Fully Responsive:** Carefully crafted mobile experience.
- 🌙 **Dark Mode Ready:** Easily extensible for theming.
- 🦋 **Changesets:** Automated versioning and changelog management.
- 🧩 **Modular Architecture:** Well-organized components split into Layouts, Sections, and UI elements.

## Directory Structure

```
├── app/
│   ├── layout.tsx      # Root layout with font and metadata config
│   ├── page.tsx        # Main landing page
│   └── globals.css     # Global styles and Tailwind utilities
├── components/
│   ├── layout/         # Header, Footer, Container elements
│   ├── sections/       # Reusable page sections (Hero, Features, FAQ)
│   └── ui/             # Shadcn UI components
└── lib/
    └── utils.ts        # Utility functions (cn for Tailwind classes)
```

## Getting Started

1. Clone or copy this repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Run the development server:
   ```bash
   pnpm dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Adding new components

This template uses Shadcn UI. To add new components, use the CLI:

```bash
pnpm dlx shadcn@latest add [component-name]
```

Browse available components at [ui.shadcn.com](https://ui.shadcn.com/).
