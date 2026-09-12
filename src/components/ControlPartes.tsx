'use client';

import type { Regalo } from '@/data/regalos';
import { COPY } from '@/lib/copy';
import estilos from './ControlPartes.module.css';

type Props = {
  regalo: Regalo;
  /** Partes de este regalo que hay en el carrito. */
  enCarro: number;
  /** true cuando cubierto >= objetivo, contando ya lo que hay en el carrito. */
  lleno: boolean;
  agregar: () => void;
  quitar: () => void;
};

export function ControlPartes({ regalo, enCarro, lleno, agregar, quitar }: Props) {
  /* Sin nada en el carrito el control es un solo botón. */
  if (enCarro === 0) {
    return (
      <div className={estilos.control}>
        <button
          type="button"
          className={`btn btn-secundario ${estilos.regalar}`}
          onClick={agregar}
          disabled={lleno}
        >
          {lleno ? COPY.regalos.completo : COPY.regalos.regalar}
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
