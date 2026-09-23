import type { Contenido } from '@/contenido/esquema';
import { nombrePareja } from '@/contenido/esquema';
import { COPY } from '@/lib/copy';
import { Foto } from './Foto';
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

      <Foto
        className={estilos.foto}
        variante="grande"
        ratio="16 / 10"
        src={portada.foto?.url}
        alt={portada.foto?.alt || COPY.foto.altPortada(nombrePareja(contenido))}
        especificacion={COPY.foto.especificacionPortada}
        pie={portada.foto?.pie}
      />
    </section>
  );
}
