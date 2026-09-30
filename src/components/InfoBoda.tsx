import type { Contenido } from '@/contenido/esquema';
import { COPY } from '@/lib/copy';
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

        {/* El mapa es un iframe de Google Maps con `output=embed`: no pide
            clave, así que el sitio sigue exportándose estático y sin
            variables de entorno. Con `loading="lazy"` no se descarga nada
            hasta que la sección entra en pantalla, que es lo que lo hace
            viable en un teléfono. */}
        <iframe
          className={estilos.mapa}
          title={COPY.mapa.titulo}
          src={`https://maps.google.com/maps?q=${encodeURIComponent(
            boda.enlace.consulta,
          )}&z=15&output=embed`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />

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
