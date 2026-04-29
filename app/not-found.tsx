import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4">
      <h2 className="mb-2 text-4xl font-bold">404</h2>
      <p className="text-muted-foreground mb-6">Page not found</p>
      <Link
        href="/"
        className="bg-primary text-primary-foreground rounded-md px-4 py-2 transition-opacity hover:opacity-90"
      >
        Return Home
      </Link>
    </div>
  );
}
