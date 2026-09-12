import type { Metadata, Viewport } from 'next';
import { Caveat, EB_Garamond, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { COPY } from '@/lib/copy';
import '@/styles/tokens.css';
import '@/styles/base.css';
import '@/styles/botones.css';

/* Cuatro familias, cada una con su fallback declarado en tokens.css. */
const instrument = Instrument_Sans({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--fuente-instrument',
  display: 'swap',
});

const garamond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--fuente-garamond',
  display: 'swap',
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '600'],
  variable: '--fuente-caveat',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--fuente-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: `${COPY.pareja} · Lista de regalos`,
  description: COPY.portada.cita,
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es-CL"
      className={`${instrument.variable} ${garamond.variable} ${caveat.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
