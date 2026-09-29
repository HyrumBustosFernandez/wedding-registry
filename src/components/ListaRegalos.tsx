'use client';

import { useState } from 'react';

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

/* Cuántos se ven antes de expandir. Cuatro es una fila entera en escritorio. */
const A_LA_VISTA = 4;

export function ListaRegalos({ carrito, regalos, opciones }: Props) {
  const [expandida, setExpandida] = useState(false);
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
        {(expandida ? carrito.regalosOrdenados : carrito.regalosOrdenados.slice(0, A_LA_VISTA)).map((regalo) => (
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

      {carrito.regalosOrdenados.length > A_LA_VISTA && (
        <div className={estilos.masCaja}>
          <button
            type="button"
            className={estilos.mas}
            aria-expanded={expandida}
            onClick={() => setExpandida((v) => !v)}
          >
            <span className={estilos.masTexto}>
              {expandida ? COPY.regalos.verMenos : COPY.regalos.verTodos(carrito.regalosOrdenados.length)}
            </span>
            <span className={estilos.masFlecha} aria-hidden="true" />
          </button>
        </div>
      )}
    </>
  );
}
