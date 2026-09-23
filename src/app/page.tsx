import { EditorProvider } from '@/components/editor/EditorContexto';
import { Sitio } from '@/components/Sitio';
import { leerContenido } from '@/server/almacen';
import { hayClaveConfigurada, puedeEditar } from '@/server/sesion';

/* El contenido se lee en cada request: lo que los novios guarden tiene que
   verse de inmediato, sin esperar una revalidación. */
export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const [contenido, autorizado] = await Promise.all([leerContenido(), puedeEditar()]);

  return (
    <EditorProvider inicial={contenido} autorizado={autorizado}>
      <Sitio hayClave={hayClaveConfigurada()} />
    </EditorProvider>
  );
}
