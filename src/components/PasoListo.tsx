'use client';

import type { Cierre } from '@/hooks/useCarrito';
import { COPY } from '@/lib/copy';
import { Modal } from './Modal';
import { ResumenLineas } from './ResumenLineas';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './Checkout.module.css';

const copy = COPY.checkout.listo;

type Props = {
  nombre: string;
  /** Snapshot tomado al pagar: no se vacía cuando se limpia el carrito. */
  cierre: Cierre;
  alVolver: () => void;
};

export function PasoListo({ nombre, cierre, alVolver }: Props) {
  return (
    <Modal aria={copy.aria} alCerrar={alVolver}>
      <div className={estilos.listo}>
        <p className={estilos.gracias}>{copy.gracias}</p>
        <SubrayadoOndulado className={estilos.onda} />

        <h2 className={estilos.tituloListo}>{copy.titulo(nombre)}</h2>

        <ResumenLineas
          className={estilos.resumenListo}
          lineas={cierre.lineas}
          total={cierre.total}
        />

        <p className={estilos.textoListo}>{copy.texto}</p>

        <div className={estilos.botonera}>
          <button
            type="button"
            className={`btn btn-primario ${estilos.botonAncho}`}
            onClick={alVolver}
          >
            {copy.volverLista}
          </button>
        </div>
      </div>
    </Modal>
  );
}
