'use client';

import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import estilos from './BarraCarrito.module.css';

type Props = {
  total: number;
  cantidadRegalos: number;
  /** Visible solo si hay total y no hay ningún modal abierto. */
  visible: boolean;
  alVaciar: () => void;
  alContinuar: () => void;
};

export function BarraCarrito({
  total,
  cantidadRegalos,
  visible,
  alVaciar,
  alContinuar,
}: Props) {
  return (
    <div
      role="region"
      aria-label={COPY.barra.region}
      aria-hidden={!visible}
      className={`${estilos.barra} ${visible ? estilos.visible : ''}`}
    >
      <div className={`contenedor ${estilos.interior}`}>
        <div className={estilos.resumen}>
          <p className="kicker">{COPY.barra.kicker}</p>
          <p className={estilos.total} aria-live="polite">
            {clp(total)}
          </p>
          <p className={estilos.elegidos}>
            {cantidadRegalos > 0 ? COPY.barra.elegidos(cantidadRegalos) : ''}
          </p>
        </div>

        <div className={estilos.acciones}>
          <button
            type="button"
            className={`btn btn-fantasma ${estilos.vaciar}`}
            onClick={alVaciar}
            tabIndex={visible ? undefined : -1}
          >
            {COPY.barra.vaciar}
          </button>
          <button
            type="button"
            className={`btn btn-primario ${estilos.continuar}`}
            onClick={alContinuar}
            tabIndex={visible ? undefined : -1}
          >
            {COPY.barra.continuar}
          </button>
        </div>
      </div>
    </div>
  );
}
