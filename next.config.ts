import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* El sitio dejó de ser export estático: el contenido se lee de la base en
     cada request y el Modo edición necesita Server Actions. */
  images: {
    remotePatterns: [{ protocol: 'https', hostname: '*.public.blob.vercel-storage.com' }],
  },
};

export default nextConfig;
