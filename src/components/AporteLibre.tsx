'use client';

import type { Contenido } from '@/contenido/esquema';
import { clp, formatearInputMonto } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import estilos from './AporteLibre.module.css';

type Props = {
  libre: Contenido['libre'];
  valor: string;
  alEscribir: (valor: string) => void;
  alFijarTexto: (valor: string) => void;
  alConfirmar: () => void;
};

export function AporteLibre({ libre, valor, alEscribir, alFijarTexto, alConfirmar }: Props) {
  return (
    <section id="libre" className={estilos.panel}>
      <p className="kicker">{libre.kicker}</p>
      <h3 className={estilos.titulo}>{libre.titulo}</h3>
      <p className={estilos.texto}>{libre.texto}</p>

      {/* Los montos sugeridos solo rellenan el input; no agregan nada al total. */}
      <div role="group" aria-label={COPY.libre.sugeridosLabel} className={estilos.sugeridos}>
        {libre.sugeridos.map((monto) => (
          <button
            key={monto}
            type="button"
            className={`btn btn-secundario ${estilos.sugerido}`}
            onClick={() => alFijarTexto(formatearInputMonto(String(monto)))}
          >
            {clp(monto)}
          </button>
        ))}
      </div>

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
          {COPY.libre.agregar}
        </button>
      </div>
    </section>
  );
}
