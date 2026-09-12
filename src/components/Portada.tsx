import { COPY } from '@/lib/copy';
import { Foto } from './Foto';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './Portada.module.css';

const { portada } = COPY;

export function Portada() {
  return (
    <section className={estilos.portada}>
      <p className="kicker">{portada.kicker}</p>

      <h1 className={estilos.titulo}>
        {portada.nombreUno}
        <br />
        <span className={estilos.conjuncion}>{portada.conjuncion}</span>
        {portada.nombreDos}
      </h1>

      <SubrayadoOndulado className={estilos.onda} />

      <div className={estilos.datos}>
        {portada.datos.map((dato) => (
          <div key={dato.kicker}>
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
        alt={portada.foto.alt}
        especificacion={portada.foto.especificacion}
        pie={portada.foto.pie}
      />
    </section>
  );
}
