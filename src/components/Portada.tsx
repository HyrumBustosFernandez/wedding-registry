import type { Contenido } from '@/contenido/esquema';
import { Carrusel } from './Carrusel';
import { RevelarAlScroll } from './RevelarAlScroll';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import { TituloPortada } from './TituloPortada';
import estilos from './Portada.module.css';

export function Portada({ contenido }: { contenido: Contenido }) {
  const { portada } = contenido;

  return (
    /* Los nombres abren la sección, justo debajo de la foto de apertura y ya
       sobre el blanco de la página: el logo se lee sobre su propio fondo y no
       sobre el cielo de la foto. */
    <section className={estilos.portada}>
      <TituloPortada contenido={contenido} />

      <SubrayadoOndulado className={estilos.onda} />

      <div className={estilos.datos}>
        {portada.datos.map((dato) => (
          <div key={dato.id}>
            <span className="kicker">{dato.kicker}</span>
            <span className={`${estilos.valor} ${dato.numerico ? estilos.numerico : ''}`}>
              {dato.valor}
            </span>
          </div>
        ))}
      </div>

      <RevelarAlScroll className={estilos.foto}>
        <Carrusel />
      </RevelarAlScroll>

      {/* La firma cierra la portada: es el pie del carrusel, no del texto. */}
      <p className={estilos.firma}>{portada.firma}</p>
    </section>
  );
}
