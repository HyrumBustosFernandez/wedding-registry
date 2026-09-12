'use client';

import type { Regalo } from '@/data/regalos';
import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { ControlPartes } from './ControlPartes';
import { Foto } from './Foto';
import estilos from './FilaRegalo.module.css';

type Props = {
  regalo: Regalo;
  /** Partes cubiertas en vivo: semilla + progreso pagado + lo que hay en el carrito. */
  cubierto: number;
  enCarro: number;
  lleno: boolean;
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
  mostrarMiniatura,
  mostrarNota,
  agregar,
  quitar,
}: Props) {
  const pct = Math.min(100, Math.round((cubierto / regalo.objetivo) * 100));

  return (
    <article className={estilos.fila}>
      {mostrarMiniatura && (
        <Foto
          className={estilos.miniatura}
          variante="mini"
          ratio="1"
          alt={COPY.regalos.fotoAlt(regalo.nombre)}
        />
      )}

      <div className={estilos.texto}>
        <h3 className={estilos.nombre}>{regalo.nombre}</h3>
        {mostrarNota && <p className={estilos.nota}>{regalo.nota}</p>}

        <div className={estilos.progreso}>
          <div className={estilos.relleno} style={{ width: `${pct}%` }} />
        </div>

        <p className={`${estilos.avance} ${lleno ? estilos.avanceCompleto : ''}`}>
          {lleno ? COPY.regalos.completoGracias : COPY.regalos.avance(cubierto, regalo.objetivo)}
        </p>
      </div>

      <p className={`${estilos.precio} ${lleno ? estilos.precioCompleto : ''}`}>
        {clp(regalo.precio)}
      </p>

      <ControlPartes
        regalo={regalo}
        enCarro={enCarro}
        lleno={lleno}
        agregar={agregar}
        quitar={quitar}
      />
    </article>
  );
}
