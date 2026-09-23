import { Encabezado } from '@/components/Encabezado';
import { InfoBoda } from '@/components/InfoBoda';
import { Portada } from '@/components/Portada';
import { SeccionRegalos } from '@/components/SeccionRegalos';
import { nombrePareja } from '@/contenido/esquema';
import { variablesDeTema } from '@/lib/tema';
import { leerContenido } from '@/server/almacen';

/* El contenido se lee en cada request: lo que los novios guarden tiene que
   verse de inmediato, sin esperar una revalidación. */
export const dynamic = 'force-dynamic';

export default async function Pagina() {
  const contenido = await leerContenido();

  return (
    <div style={variablesDeTema(contenido.opciones)}>
      <Encabezado pareja={nombrePareja(contenido)} />
      <main>
        <Portada contenido={contenido} />
        <InfoBoda boda={contenido.boda} />
        <SeccionRegalos contenido={contenido} />
      </main>
    </div>
  );
}
