import type { Metadata, Viewport } from 'next';
import { Caveat, EB_Garamond, IBM_Plex_Mono, Instrument_Sans } from 'next/font/google';
import { CONTENIDO } from '@/contenido/contenido';
import { nombrePareja } from '@/contenido/esquema';
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
  title: `${nombrePareja(CONTENIDO)} · Lista de regalos`,
  description: CONTENIDO.regalos.intro,
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
      <body>
        {/* Sin JavaScript no corre el observador que revela las secciones, así
            que se anula el estado inicial escondido. */}
        <noscript>
          <style>{`[class*="revelar"] { opacity: 1 !important; transform: none !important; }`}</style>
        </noscript>
        {children}
      </body>
    </html>
  );
}
