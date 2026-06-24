import type { Metadata } from 'next';
import { Anton, Inter, Fraunces } from 'next/font/google';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const display = Anton({ subsets: ['latin'], weight: '400', variable: '--font-display' });
const body = Inter({ subsets: ['latin'], variable: '--font-body' });
const accent = Fraunces({ subsets: ['latin'], style: ['italic'], variable: '--font-accent' });

export const metadata: Metadata = {
  title: "BUCHA'S — Premium Clothing",
  description: 'Heavyweight basics and outerwear, dyed and cut for the city. Order direct on WhatsApp.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${display.variable} ${body.variable} ${accent.variable} font-body bg-bone text-ink antialiased`}>
        <div className="grain" />
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
