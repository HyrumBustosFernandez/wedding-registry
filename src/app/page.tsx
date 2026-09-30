import { Confirmacion } from '@/components/Confirmacion';
import { Encabezado } from '@/components/Encabezado';
import { FondoDecorado } from '@/components/FondoDecorado';
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
    <div className="pagina" style={variablesDeTema(CONTENIDO.opciones)}>
      <FondoDecorado />

      <Encabezado pareja={nombrePareja(CONTENIDO)} />

      <main>
        {/* Abre con la foto a sangre completa y limpia: los nombres vienen
            después, ya sobre el blanco de la página. */}
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
