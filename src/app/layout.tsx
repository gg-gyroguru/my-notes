import type { Metadata } from 'next';
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/utils/auth-context.tsx';
import SplashScreen from '@/components/SplashScreen.tsx';
import Navbar from '@/components/Navbar.tsx';
import ConnectFloatingBtn from '@/components/ConnectFloatingBtn.tsx';
import Link from 'next/link';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-outfit',
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--font-mono',
});

export const metadata: Metadata = {
  title: 'The Brainstorming — MP D.El.Ed Smart Notes Hub',
  description:
    'Complete e-learning and structured academic notes platform for MP D.El.Ed 1st Year & 2nd Year students featuring unit-wise notes, solved PYQs, and protected PDF folders.',
  openGraph: {
    title: 'The Brainstorming — MP D.El.Ed Smart Notes Hub',
    description:
      'Complete e-learning and structured academic notes platform for MP D.El.Ed 1st Year & 2nd Year students featuring unit-wise notes, solved PYQs, and protected PDF folders.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Brainstorming — MP D.El.Ed Smart Notes Hub',
    description:
      'Complete e-learning and structured academic notes platform for MP D.El.Ed 1st Year & 2nd Year students featuring unit-wise notes, solved PYQs, and protected PDF folders.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${outfit.variable} ${plusJakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body
        suppressHydrationWarning
        className="min-h-screen flex flex-col bg-slate-950 font-sans text-slate-100 selection:bg-purple-600 selection:text-white"
      >
        <AuthProvider>
          <SplashScreen />
          <Navbar />
          <div className="flex-1">{children}</div>

          {/* Clean Editorial Footer */}
          <footer className="border-t border-slate-900 bg-slate-950 py-10">
            <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 sm:flex-row sm:items-center">
              <div>
                <p className="font-display text-sm font-bold text-white">
                  The Brainstorming
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  MPBSE D.El.Ed (1st Year &amp; 2nd Year) Smart Academic Notes &amp; Solved PYQ Repository
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400">
                <Link href="/" className="hover:text-white transition-colors">
                  Home
                </Link>
                <Link href="/notes" className="hover:text-white transition-colors">
                  Notes Catalog
                </Link>
                <Link href="/login" className="hover:text-white transition-colors">
                  Student Portal
                </Link>
                <a
                  href="https://gg-gyaniguru.vercel.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 transition-colors"
                >
                  Gyani Guru Network
                </a>
              </div>
            </div>
          </footer>

          <ConnectFloatingBtn />
        </AuthProvider>
      </body>
    </html>
  );
}
