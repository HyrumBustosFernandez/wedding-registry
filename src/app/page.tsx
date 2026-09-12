import { Encabezado } from '@/components/Encabezado';
import { InfoBoda } from '@/components/InfoBoda';
import { Portada } from '@/components/Portada';

export default function Pagina() {
  return (
    <>
      <Encabezado />
      <main>
        <Portada />
        <InfoBoda />
      </main>
    </>
  );
}
