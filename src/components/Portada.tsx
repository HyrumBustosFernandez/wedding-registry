import type { Contenido } from '@/contenido/esquema';
import { Carrusel } from './Carrusel';
import { RevelarAlScroll } from './RevelarAlScroll';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './Portada.module.css';

export function Portada({ contenido }: { contenido: Contenido }) {
  const { portada } = contenido;

  return (
    /* El rótulo y los nombres ya no están acá: van sobrepuestos a la foto de
       apertura, en <TituloPortada>. */
    <section className={estilos.portada}>
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

      <blockquote className={estilos.cita}>{portada.cita}</blockquote>
      <p className={estilos.firma}>{portada.firma}</p>

      <RevelarAlScroll className={estilos.foto}>
        <Carrusel />
      </RevelarAlScroll>
    </section>
  );
}
