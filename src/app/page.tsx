import { Encabezado } from '@/components/Encabezado';
import { InfoBoda } from '@/components/InfoBoda';
import { Portada } from '@/components/Portada';
import { SeccionRegalos } from '@/components/SeccionRegalos';
import { CONTENIDO } from '@/contenido/contenido';
import { nombrePareja } from '@/contenido/esquema';
import { variablesDeTema } from '@/lib/tema';

export default function Pagina() {
  return (
    <div style={variablesDeTema(CONTENIDO.opciones)}>
      <Encabezado pareja={nombrePareja(CONTENIDO)} />
      <main>
        <Portada contenido={CONTENIDO} />
        <InfoBoda boda={CONTENIDO.boda} />
        <SeccionRegalos contenido={CONTENIDO} />
      </main>
    </div>
  );
}
