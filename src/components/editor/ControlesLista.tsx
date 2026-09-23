'use client';

import { useEditando } from './EditorContexto';
import estilos from './ControlesLista.module.css';

type ControlesProps = {
  /** Qué se está ordenando, para los textos de accesibilidad: "bloque", "regalo"… */
  etiqueta: string;
  indice: number;
  total: number;
  alSubir: () => void;
  alBajar: () => void;
  alEliminar: () => void;
};

/** Mover y eliminar un elemento. Solo se dibuja en Modo edición. */
export function ControlesItem({
  etiqueta,
  indice,
  total,
  alSubir,
  alBajar,
  alEliminar,
}: ControlesProps) {
  const editando = useEditando();
  if (!editando) return null;

  return (
    <div className={estilos.controles}>
      <button
        type="button"
        className={estilos.boton}
        onClick={alSubir}
        disabled={indice === 0}
        aria-label={`Subir ${etiqueta} ${indice + 1}`}
        title="Subir"
      >
        ↑
      </button>
      <button
        type="button"
        className={estilos.boton}
        onClick={alBajar}
        disabled={indice === total - 1}
        aria-label={`Bajar ${etiqueta} ${indice + 1}`}
        title="Bajar"
      >
        ↓
      </button>
      <button
        type="button"
        className={`${estilos.boton} ${estilos.eliminar}`}
        onClick={alEliminar}
        aria-label={`Eliminar ${etiqueta} ${indice + 1}`}
        title="Eliminar"
      >
        ×
      </button>
    </div>
  );
}

/** Botón de "agregar" al final de una lista. Solo en Modo edición. */
export function BotonAgregar({ texto, alAgregar }: { texto: string; alAgregar: () => void }) {
  const editando = useEditando();
  if (!editando) return null;

  return (
    <button type="button" className={estilos.agregar} onClick={alAgregar}>
      + {texto}
    </button>
  );
}

/* --- utilidades de lista, compartidas por portada, boda y regalos --- */

export function mover<T>(lista: T[], desde: number, hasta: number): T[] {
  if (hasta < 0 || hasta >= lista.length) return lista;
  const copia = [...lista];
  const [item] = copia.splice(desde, 1);
  copia.splice(hasta, 0, item);
  return copia;
}

export function reemplazar<T>(lista: T[], indice: number, item: T): T[] {
  return lista.map((actual, i) => (i === indice ? item : actual));
}

export function eliminar<T>(lista: T[], indice: number): T[] {
  return lista.filter((_, i) => i !== indice);
}
