import { Encabezado } from '@/components/Encabezado';
import { InfoBoda } from '@/components/InfoBoda';
import { Portada } from '@/components/Portada';
import { SeccionRegalos } from '@/components/SeccionRegalos';
import { CONFIG } from '@/config';
import { variablesDeTema } from '@/lib/tema';

export default function Pagina() {
  return (
    <div style={variablesDeTema(CONFIG)}>
      <Encabezado />
      <main>
        <Portada />
        <InfoBoda />
        <SeccionRegalos />
      </main>
    </div>
  );
}
