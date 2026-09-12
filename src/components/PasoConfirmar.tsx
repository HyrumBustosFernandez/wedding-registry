'use client';

import type { Carrito } from '@/hooks/useCarrito';
import { COPY } from '@/lib/copy';
import { Modal } from './Modal';
import { ResumenLineas } from './ResumenLineas';
import estilos from './Checkout.module.css';

const { confirmar: copy, volver } = COPY.checkout;

export function PasoConfirmar({ carrito }: { carrito: Carrito }) {
  return (
    <Modal aria={copy.aria} alCerrar={carrito.volver}>
      <p className="kicker">{copy.kicker}</p>
      <h2 className={estilos.titulo}>{copy.titulo}</h2>
      <p className={estilos.texto}>{copy.texto}</p>

      <ResumenLineas
        className={estilos.resumen}
        lineas={carrito.lineas}
        total={carrito.total}
      />

      <div className={estilos.botonera}>
        <button
          type="button"
          className={`btn btn-fantasma ${estilos.boton}`}
          onClick={carrito.volver}
        >
          {volver}
        </button>
        <button
          type="button"
          className={`btn btn-primario ${estilos.boton}`}
          onClick={carrito.pagar}
        >
          {copy.pagar}
        </button>
      </div>

      {/* Texto, no logos. */}
      <div className={estilos.metodos}>
        {copy.metodos.map((metodo) => (
          <span key={metodo}>{metodo}</span>
        ))}
      </div>
    </Modal>
  );
}
