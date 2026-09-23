'use client';

import type { Regalo } from '@/contenido/esquema';
import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { ControlPartes } from './ControlPartes';
import { Foto } from './Foto';
import estilos from './FilaRegalo.module.css';

type Props = {
  regalo: Regalo;
  cubierto: number;
  enCarro: number;
  lleno: boolean;
  /** Apagado: sin barra de progreso, sin 'X de Y' y sin tope. */
  mostrarMetas: boolean;
  mostrarMiniatura: boolean;
  mostrarNota: boolean;
  agregar: () => void;
  quitar: () => void;
};

export function FilaRegalo({
  regalo,
  cubierto,
  enCarro,
  lleno,
  mostrarMetas,
  mostrarMiniatura,
  mostrarNota,
  agregar,
  quitar,
}: Props) {
  /* El avance solo existe si hay meta contra la cual medirlo. */
  const conMeta = mostrarMetas && regalo.objetivo !== null;
  const pct = conMeta ? Math.min(100, Math.round((cubierto / regalo.objetivo!) * 100)) : 0;

  return (
    <article className={estilos.fila}>
      {mostrarMiniatura && (
        <Foto
          className={estilos.miniatura}
          variante="mini"
          ratio="1"
          src={regalo.foto?.url}
          alt={regalo.foto?.alt || COPY.foto.altRegalo(regalo.nombre)}
        />
      )}

      <div className={estilos.texto}>
        <h3 className={estilos.nombre}>{regalo.nombre}</h3>
        {mostrarNota && regalo.nota && <p className={estilos.nota}>{regalo.nota}</p>}

        {conMeta && (
          <>
            <div className={estilos.progreso}>
              <div className={estilos.relleno} style={{ width: `${pct}%` }} />
            </div>
            <p className={`${estilos.avance} ${lleno ? estilos.avanceCompleto : ''}`}>
              {lleno
                ? COPY.regalos.completoGracias
                : COPY.regalos.avance(cubierto, regalo.objetivo!)}
            </p>
          </>
        )}
      </div>

      <p className={`${estilos.precio} ${lleno ? estilos.precioCompleto : ''}`}>
        {clp(regalo.precio)}
      </p>

      <ControlPartes
        regalo={regalo}
        enCarro={enCarro}
        lleno={lleno}
        mostrarMetas={mostrarMetas}
        agregar={agregar}
        quitar={quitar}
      />
    </article>
  );
}
