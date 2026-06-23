import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-[60vh] flex flex-col items-center justify-center px-6 text-center">
      <p className="font-display text-6xl mb-4">404</p>
      <p className="text-steel mb-8">That page isn&apos;t in the rack.</p>
      <Link
        href="/"
        className="font-display uppercase tracking-widest2 text-sm bg-ink text-bone rounded-full px-8 py-4 hover:bg-clay transition-colors"
      >
        Back Home
      </Link>
    </main>
  );
}
