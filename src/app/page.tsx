import { Confirmacion } from '@/components/Confirmacion';
import { Encabezado } from '@/components/Encabezado';
import { FondoFoto } from '@/components/FondoFoto';
import { InfoBoda } from '@/components/InfoBoda';
import { PieDePagina } from '@/components/PieDePagina';
import { Portada } from '@/components/Portada';
import { RevelarAlScroll } from '@/components/RevelarAlScroll';
import { SeccionRegalos } from '@/components/SeccionRegalos';
import { CONTENIDO } from '@/contenido/contenido';
import { nombrePareja } from '@/contenido/esquema';
import { FONDO_FINAL, FONDO_INICIO } from '@/contenido/fotos';
import { variablesDeTema } from '@/lib/tema';

export default function Pagina() {
  return (
    <div style={variablesDeTema(CONTENIDO.opciones)}>
      <Encabezado pareja={nombrePareja(CONTENIDO)} />

      <main>
        {/* Abre con la foto a sangre completa, que se funde con el blanco de
            la portada en vez de cortar en seco. */}
        <FondoFoto foto={FONDO_INICIO} posicion="inicio" />

        <Portada contenido={CONTENIDO} />

        <RevelarAlScroll>
          <InfoBoda boda={CONTENIDO.boda} />
        </RevelarAlScroll>

        <RevelarAlScroll como="section" className="seccion">
          <div className="contenedor">
            <Confirmacion confirmacion={CONTENIDO.confirmacion} />
          </div>
        </RevelarAlScroll>

        <SeccionRegalos contenido={CONTENIDO} />

        {/* Cierra con el pie apoyado sobre la foto: la despedida ya no flota en
            una franja blanca, y el degradado corre por toda la banda. */}
        <FondoFoto foto={FONDO_FINAL} posicion="final">
          <PieDePagina pie={CONTENIDO.pie} />
        </FondoFoto>
      </main>
    </div>
  );
}
