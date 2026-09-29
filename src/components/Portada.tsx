import type { Contenido } from '@/contenido/esquema';
import { Carrusel } from './Carrusel';
import { RevelarAlScroll } from './RevelarAlScroll';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './Portada.module.css';

export function Portada({ contenido }: { contenido: Contenido }) {
  const { portada, pareja } = contenido;

  return (
    <section className={estilos.portada}>
      <p className="kicker">{portada.kicker}</p>

      <h1 className={estilos.titulo}>
        {pareja.nombreUno}
        <br />
        <span className={estilos.conjuncion}>{pareja.conjuncion}</span>
        {pareja.nombreDos}
      </h1>

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
