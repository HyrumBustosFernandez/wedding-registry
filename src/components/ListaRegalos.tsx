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

        {/* Chips en vez de un <select>: son cuatro opciones, caben a la
            vista, y un menú desplegable obliga a abrirlo para saber qué hay. */}
        <div className={estilos.orden} role="group" aria-label={COPY.regalos.ordenarLabel}>
          <span className={`kicker ${estilos.labelOrden}`}>{COPY.regalos.ordenarLabel}</span>
          <div className={estilos.chips}>
            {opcionesOrden.map((opcion) => (
              <button
                key={opcion.valor}
                type="button"
                className={`${estilos.chip} ${carrito.orden === opcion.valor ? estilos.chipActivo : ''}`}
                aria-pressed={carrito.orden === opcion.valor}
                title={opcion.texto}
                onClick={() => carrito.setOrden(opcion.valor as Orden)}
              >
                {opcion.corto}
              </button>
            ))}
          </div>
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
