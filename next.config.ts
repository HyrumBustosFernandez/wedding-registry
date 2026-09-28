import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* El contenido vive en el código, así que el sitio se exporta entero como
     HTML estático: sin servidor, sin base de datos y sin variables de entorno. */
  output: 'export',
  images: { unoptimized: true },
};

export default nextConfig;
