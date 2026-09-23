'use client';

import type { Contenido } from '@/contenido/esquema';
import { clp, formatearInputMonto, parsearMonto } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { useEditando, useEditor } from './editor/EditorContexto';
import { TextoEditable } from './editor/TextoEditable';
import estilos from './AporteLibre.module.css';

type Props = {
  valor: string;
  alEscribir: (valor: string) => void;
  alFijarTexto: (valor: string) => void;
  alConfirmar: () => void;
};

export function AporteLibre({ valor, alEscribir, alFijarTexto, alConfirmar }: Props) {
  const { contenido, editar } = useEditor();
  const editando = useEditando();
  const { libre } = contenido;

  const setLibre = (cambio: Partial<Contenido['libre']>) =>
    editar((c) => ({ ...c, libre: { ...c.libre, ...cambio } }));

  const setSugerido = (i: number, monto: number) =>
    setLibre({ sugeridos: libre.sugeridos.map((m, j) => (j === i ? monto : m)) });

  return (
    <section id="libre" className={estilos.panel}>
      <TextoEditable
        como="p"
        className="kicker"
        valor={libre.kicker}
        alCambiar={(kicker) => setLibre({ kicker })}
        placeholder="SIN ELEGIR NADA DE LA LISTA"
      />
      <TextoEditable
        como="h3"
        className={estilos.titulo}
        valor={libre.titulo}
        alCambiar={(titulo) => setLibre({ titulo })}
        placeholder="Aporte libre"
      />
      <TextoEditable
        como="p"
        className={estilos.texto}
        valor={libre.texto}
        alCambiar={(texto) => setLibre({ texto })}
        multilinea
        placeholder="Expliquen para qué sirve el aporte libre"
      />

      {/* Los montos sugeridos solo rellenan el input; no agregan nada al total. */}
      <div role="group" aria-label={COPY.libre.sugeridosLabel} className={estilos.sugeridos}>
        {libre.sugeridos.map((monto, i) =>
          editando ? (
            <label key={i} className={`${estilos.sugerido} ${estilos.sugeridoEditor}`}>
              <span className="oculto-visual">Monto sugerido {i + 1}</span>
              <input
                type="text"
                inputMode="numeric"
                className={estilos.sugeridoInput}
                value={formatearInputMonto(String(monto))}
                onChange={(e) => setSugerido(i, parsearMonto(e.target.value))}
              />
            </label>
          ) : (
            <button
              key={i}
              type="button"
              className={`btn btn-secundario ${estilos.sugerido}`}
              onClick={() => alFijarTexto(formatearInputMonto(String(monto)))}
            >
              {clp(monto)}
            </button>
          ),
        )}
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
          disabled={editando}
        />
        <button
          type="button"
          className={`btn btn-primario ${estilos.agregar}`}
          onClick={alConfirmar}
          disabled={editando}
        >
          {COPY.libre.agregar}
        </button>
      </div>
    </section>
  );
}
