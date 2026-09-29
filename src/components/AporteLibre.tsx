'use client';

import type { Contenido } from '@/contenido/esquema';
import { COPY } from '@/lib/copy';
import estilos from './AporteLibre.module.css';

type Props = {
  libre: Contenido['libre'];
  valor: string;
  alEscribir: (valor: string) => void;
  alConfirmar: () => void;
};

export function AporteLibre({ libre, valor, alEscribir, alConfirmar }: Props) {
  return (
    <section id="libre" className={estilos.panel}>
      <h3 className={estilos.titulo}>{libre.titulo}</h3>

      <div className={estilos.entrada}>
        <label className="oculto-visual" htmlFor="montoLibre">
          {COPY.libre.inputLabel}
        </label>
        <input
          id="montoLibre"
          className={estilos.input}
          inputMode="numeric"
          placeholder={COPY.libre.inputPlaceholder}
          value={valor}
          onChange={(e) => alEscribir(e.target.value)}
        />
        <button
          type="button"
          className={`btn btn-primario ${estilos.agregar}`}
          onClick={alConfirmar}
        >
          {libre.boton}
        </button>
      </div>
    </section>
  );
}
