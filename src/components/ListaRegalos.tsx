'use client';

import type { Carrito, Orden } from '@/hooks/useCarrito';
import { COPY } from '@/lib/copy';
import { FilaRegalo } from './FilaRegalo';
import estilos from './ListaRegalos.module.css';

type Props = {
  carrito: Carrito;
  mostrarMiniaturas: boolean;
  mostrarNotas: boolean;
};

export function ListaRegalos({ carrito, mostrarMiniaturas, mostrarNotas }: Props) {
  return (
    <>
      <div className={estilos.cabecera}>
        <div className={estilos.presentacion}>
          <p className="kicker">{COPY.regalos.kicker}</p>
          <h2 className={estilos.titulo}>{COPY.regalos.titulo}</h2>
          <p className={estilos.intro}>{COPY.regalos.intro}</p>
        </div>

        <div className={estilos.orden}>
          <label className="kicker" htmlFor="orden">
            {COPY.regalos.ordenarLabel}
          </label>
          <select
            id="orden"
            className={estilos.select}
            value={carrito.orden}
            onChange={(e) => carrito.setOrden(e.target.value as Orden)}
          >
            {COPY.regalos.opcionesOrden.map((opcion) => (
              <option key={opcion.valor} value={opcion.valor}>
                {opcion.texto}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={estilos.lista}>
        {carrito.regalosOrdenados.map((regalo) => (
          <FilaRegalo
            key={regalo.id}
            regalo={regalo}
            cubierto={carrito.cubierto(regalo)}
            enCarro={carrito.enCarro(regalo)}
            lleno={carrito.lleno(regalo)}
            mostrarMiniatura={mostrarMiniaturas}
            mostrarNota={mostrarNotas}
            agregar={() => carrito.agregar(regalo)}
            quitar={() => carrito.quitar(regalo)}
          />
        ))}
      </div>
    </>
  );
}
