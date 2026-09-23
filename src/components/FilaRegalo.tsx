'use client';

import type { ReactNode } from 'react';
import type { Regalo } from '@/contenido/esquema';
import { clp, formatearInputMonto, parsearMonto } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { ControlPartes } from './ControlPartes';
import { useEditando } from './editor/EditorContexto';
import { FotoEditable } from './editor/FotoEditable';
import { TextoEditable } from './editor/TextoEditable';
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
  /** Modo edición: aplica un cambio a este regalo. */
  alCambiar: (regalo: Regalo) => void;
  /** Los botones de mover/eliminar, que arma la lista. */
  controles: ReactNode;
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
  alCambiar,
  controles,
}: Props) {
  const editando = useEditando();

  /* El avance solo existe si hay meta contra la cual medirlo. */
  const conMeta = mostrarMetas && regalo.objetivo !== null;
  const pct = conMeta ? Math.min(100, Math.round((cubierto / regalo.objetivo!) * 100)) : 0;

  return (
    <article className={estilos.fila}>
      {mostrarMiniatura && (
        <FotoEditable
          className={estilos.miniatura}
          variante="mini"
          ratio="1"
          foto={regalo.foto}
          alCambiar={(foto) => alCambiar({ ...regalo, foto })}
          altPorDefecto={COPY.foto.altRegalo(regalo.nombre)}
        />
      )}

      <div className={estilos.texto}>
        <TextoEditable
          como="h3"
          className={estilos.nombre}
          valor={regalo.nombre}
          alCambiar={(nombre) => alCambiar({ ...regalo, nombre })}
          placeholder="Nombre del regalo"
        />

        {(mostrarNota || editando) && (
          <TextoEditable
            como="p"
            className={estilos.nota}
            valor={regalo.nota}
            alCambiar={(nota) => alCambiar({ ...regalo, nota })}
            multilinea
            placeholder="Nota corta (se muestra si activas «Notas de cada regalo»)"
          />
        )}

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

        {editando && (
          <div className={estilos.editorCampos}>
            <label className={estilos.campoNumero}>
              Monto
              <input
                type="text"
                inputMode="numeric"
                className={estilos.numero}
                value={formatearInputMonto(String(regalo.precio))}
                onChange={(e) => alCambiar({ ...regalo, precio: parsearMonto(e.target.value) })}
              />
            </label>

            {mostrarMetas && (
              <label className={estilos.campoNumero}>
                Meta (partes)
                <input
                  type="number"
                  min={1}
                  className={`${estilos.numero} ${estilos.numeroCorto}`}
                  value={regalo.objetivo ?? ''}
                  placeholder="sin meta"
                  onChange={(e) =>
                    alCambiar({
                      ...regalo,
                      objetivo: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                />
              </label>
            )}
          </div>
        )}

        {controles}
      </div>

      <p className={`${estilos.precio} ${lleno ? estilos.precioCompleto : ''}`}>
        {clp(regalo.precio)}
      </p>

      {!editando && (
        <ControlPartes
          regalo={regalo}
          enCarro={enCarro}
          lleno={lleno}
          mostrarMetas={mostrarMetas}
          agregar={agregar}
          quitar={quitar}
        />
      )}
    </article>
  );
}
