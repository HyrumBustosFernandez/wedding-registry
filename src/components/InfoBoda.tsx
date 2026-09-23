import type { Contenido } from '@/contenido/esquema';
import { DivisorAnillo } from './DivisorAnillo';
import estilos from './InfoBoda.module.css';

export function InfoBoda({ boda }: { boda: Contenido['boda'] }) {
  return (
    <section id="boda" className="seccion">
      <div className="contenedor">
        <DivisorAnillo className={estilos.anillo} />

        <p className="kicker">{boda.kicker}</p>
        <h2 className={estilos.titulo}>{boda.titulo}</h2>

        <div className={estilos.grid}>
          {boda.bloques.map((bloque) => (
            <div key={bloque.id}>
              <p className={`kicker ${estilos.bloqueKicker}`}>{bloque.kicker}</p>
              <h3 className={estilos.bloqueTitulo}>{bloque.titulo}</h3>
              <p className={estilos.bloqueTexto}>{bloque.texto}</p>
            </div>
          ))}
        </div>

        {boda.enlace.texto && (
          <a
            className={estilos.comoLlegar}
            href={boda.enlace.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {boda.enlace.texto}
          </a>
        )}
      </div>
    </section>
  );
}
