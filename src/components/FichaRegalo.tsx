'use client';

import type { Regalo } from '@/contenido/esquema';
import { fotoDeRegalo } from '@/contenido/fotos';
import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { Foto } from './Foto';
import estilos from './FichaRegalo.module.css';

type Props = {
  regalo: Regalo;
  texto: string;
  monto: number;
  alEscribir: (valor: string) => void;
  alConfirmar: () => void;
  alQuitar: () => void;
};

/**
 * Una celda de la rejilla de regalos: foto, nombre y una casilla para el
 * aporte. Deliberadamente callada —sin tarjeta, sin sombra, sin borde— para
 * que la lista no le quite protagonismo a las fotos de la pareja.
 */
export function FichaRegalo({ regalo, texto, monto, alEscribir, alConfirmar, alQuitar }: Props) {
  const foto = fotoDeRegalo(regalo.id);
  const elegido = monto > 0;
  const idInput = `aporte-${regalo.id}`;

  return (
    <article className={`${estilos.ficha} ${elegido ? estilos.elegida : ''}`}>
      <Foto
        className={estilos.foto}
        variante="mini"
        ratio="1"
        src={foto?.url}
        alt={foto?.alt || COPY.foto.altRegalo(regalo.nombre)}
        especificacion={COPY.foto.especificacionRegalo}
      />

      <h3 className={estilos.nombre}>{regalo.nombre}</h3>
      <p className={estilos.sugerido}>{COPY.regalos.sugerido(clp(regalo.precio))}</p>

      {elegido ? (
        <p className={estilos.puesto}>
          <span className={estilos.montoPuesto}>{clp(monto)}</span>
          <button type="button" className={estilos.quitar} onClick={alQuitar}>
            {COPY.regalos.quitarAporte}
          </button>
        </p>
      ) : (
        <div className={estilos.entrada}>
          <label className="oculto-visual" htmlFor={idInput}>
            {COPY.regalos.aporteLabel(regalo.nombre)}
          </label>
          <input
            id={idInput}
            className={estilos.input}
            inputMode="numeric"
            placeholder={COPY.libre.inputPlaceholder}
            value={texto}
            onChange={(e) => alEscribir(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                alConfirmar();
              }
            }}
          />
          <button type="button" className={estilos.agregar} onClick={alConfirmar}>
            {COPY.regalos.aportar}
          </button>
        </div>
      )}
    </article>
  );
}
