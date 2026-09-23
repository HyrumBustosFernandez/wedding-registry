'use client';

import { nuevoId, type Contenido, type Regalo } from '@/contenido/esquema';
import type { Carrito, Orden } from '@/hooks/useCarrito';
import { COPY } from '@/lib/copy';
import { BotonAgregar, ControlesItem, eliminar, mover } from './editor/ControlesLista';
import { useEditando, useEditor } from './editor/EditorContexto';
import { TextoEditable } from './editor/TextoEditable';
import { FilaRegalo } from './FilaRegalo';
import estilos from './ListaRegalos.module.css';

export function ListaRegalos({ carrito }: { carrito: Carrito }) {
  const { contenido, editar } = useEditor();
  const editando = useEditando();
  const { regalos, opciones } = contenido;

  const setRegalos = (cambio: Partial<Contenido['regalos']>) =>
    editar((c) => ({ ...c, regalos: { ...c.regalos, ...cambio } }));

  const setItems = (items: Regalo[]) => setRegalos({ items });

  /* En edición se listan en su orden real, para que mover arriba/abajo
     signifique algo; el selector de orden es cosa del invitado. */
  const lista = editando ? regalos.items : carrito.regalosOrdenados;

  /* "Los que más faltan" no significa nada sin metas. */
  const opcionesOrden = COPY.regalos.opcionesOrden.filter(
    (o) => o.valor !== 'faltan' || opciones.mostrarMetas,
  );

  return (
    <>
      <div className={estilos.cabecera}>
        <div className={estilos.presentacion}>
          <TextoEditable
            como="p"
            className="kicker"
            valor={regalos.kicker}
            alCambiar={(kicker) => setRegalos({ kicker })}
            placeholder="LA LISTA"
          />
          <TextoEditable
            como="h2"
            className={estilos.titulo}
            valor={regalos.titulo}
            alCambiar={(titulo) => setRegalos({ titulo })}
            placeholder="Título de la lista"
          />
          <TextoEditable
            como="p"
            className={estilos.intro}
            valor={regalos.intro}
            alCambiar={(intro) => setRegalos({ intro })}
            multilinea
            placeholder="Expliquen cómo funciona la lista"
          />
        </div>

        {!editando && (
          <div className={estilos.orden}>
            <label className={`kicker ${estilos.labelOrden}`} htmlFor="orden">
              {COPY.regalos.ordenarLabel}
            </label>
            <select
              id="orden"
              className={estilos.select}
              value={carrito.orden}
              onChange={(e) => carrito.setOrden(e.target.value as Orden)}
            >
              {opcionesOrden.map((opcion) => (
                <option key={opcion.valor} value={opcion.valor}>
                  {opcion.texto}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      <div className={estilos.lista}>
        {lista.map((regalo) => {
          const i = regalos.items.findIndex((r) => r.id === regalo.id);
          return (
            <FilaRegalo
              key={regalo.id}
              regalo={regalo}
              cubierto={carrito.cubierto(regalo)}
              enCarro={carrito.enCarro(regalo)}
              lleno={carrito.lleno(regalo)}
              mostrarMetas={opciones.mostrarMetas}
              mostrarMiniatura={opciones.mostrarMiniaturas}
              mostrarNota={opciones.mostrarNotas}
              agregar={() => carrito.agregar(regalo)}
              quitar={() => carrito.quitar(regalo)}
              alCambiar={(actualizado) =>
                setItems(regalos.items.map((r, j) => (j === i ? actualizado : r)))
              }
              controles={
                <ControlesItem
                  etiqueta="regalo"
                  indice={i}
                  total={regalos.items.length}
                  alSubir={() => setItems(mover(regalos.items, i, i - 1))}
                  alBajar={() => setItems(mover(regalos.items, i, i + 1))}
                  alEliminar={() => setItems(eliminar(regalos.items, i))}
                />
              }
            />
          );
        })}
      </div>

      <BotonAgregar
        texto="Agregar regalo"
        alAgregar={() =>
          setItems([
            ...regalos.items,
            {
              id: nuevoId('regalo'),
              nombre: 'Regalo nuevo',
              nota: '',
              foto: null,
              precio: 30000,
              objetivo: null,
              regalados: 0,
            },
          ])
        }
      />
    </>
  );
}
