'use client';

import type { Regalo } from '@/contenido/esquema';
import { COPY } from '@/lib/copy';
import estilos from './ControlPartes.module.css';

type Props = {
  regalo: Regalo;
  /** Aportes de este regalo que hay en el carrito. */
  enCarro: number;
  /** Solo puede ser true con metas encendidas. */
  lleno: boolean;
  /** Cambia la etiqueta: sin metas se "aporta", con metas se "regala". */
  mostrarMetas: boolean;
  agregar: () => void;
  quitar: () => void;
};

export function ControlPartes({
  regalo,
  enCarro,
  lleno,
  mostrarMetas,
  agregar,
  quitar,
}: Props) {
  if (enCarro === 0) {
    const etiqueta = lleno
      ? COPY.regalos.completo
      : mostrarMetas
        ? COPY.regalos.regalar
        : COPY.regalos.aportar;

    return (
      <div className={estilos.control}>
        <button
          type="button"
          className={`btn btn-secundario ${estilos.regalar}`}
          onClick={agregar}
          disabled={lleno}
        >
          {etiqueta}
        </button>
      </div>
    );
  }

  return (
    <div className={estilos.control}>
      {/* Glifo U+2212 (minus sign), no guion. En n=1 esto saca el ítem del carrito. */}
      <button
        type="button"
        className={`btn btn-secundario ${estilos.paso}`}
        onClick={quitar}
        aria-label={COPY.regalos.quitarParte(regalo.nombre)}
      >
        −
      </button>

      <span className={estilos.cantidad} aria-hidden="true">
        {enCarro}
      </span>

      <button
        type="button"
        className={`btn btn-secundario ${estilos.paso}`}
        onClick={agregar}
        disabled={lleno}
        aria-label={COPY.regalos.agregarParte(regalo.nombre)}
      >
        +
      </button>
    </div>
  );
}
