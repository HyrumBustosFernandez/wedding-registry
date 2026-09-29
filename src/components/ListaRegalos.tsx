'use client';

import type { Contenido } from '@/contenido/esquema';
import type { Carrito, Orden } from '@/hooks/useCarrito';
import { COPY } from '@/lib/copy';
import { FichaRegalo } from './FichaRegalo';
import estilos from './ListaRegalos.module.css';

type Props = {
  carrito: Carrito;
  regalos: Contenido['regalos'];
  opciones: Contenido['opciones'];
};

export function ListaRegalos({ carrito, regalos, opciones }: Props) {
  /* "Los que más faltan" no significa nada sin metas. */
  const opcionesOrden = COPY.regalos.opcionesOrden.filter(
    (o) => o.valor !== 'faltan' || opciones.mostrarMetas,
  );

  return (
    <>
      <div className={estilos.cabecera}>
        <div className={estilos.presentacion}>
          <p className="kicker">{regalos.kicker}</p>
          <h2 className={estilos.titulo}>{regalos.titulo}</h2>
          <p className={estilos.intro}>{regalos.intro}</p>
        </div>

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
      </div>

      <div className={estilos.rejilla}>
        {carrito.regalosOrdenados.map((regalo) => (
          <FichaRegalo
            key={regalo.id}
            regalo={regalo}
            texto={carrito.montosTxt[regalo.id] ?? ''}
            monto={carrito.montos[regalo.id] ?? 0}
            alEscribir={(valor) => carrito.escribirMonto(regalo.id, valor)}
            alConfirmar={() => carrito.confirmarMonto(regalo.id)}
            alQuitar={() => carrito.quitarRegalo(regalo.id)}
          />
        ))}
      </div>
    </>
  );
}
