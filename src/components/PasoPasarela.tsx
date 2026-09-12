'use client';

import { useEffect } from 'react';
import { MS_PASARELA } from '@/hooks/useCarrito';
import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { Modal } from './Modal';
import estilos from './Checkout.module.css';

const copy = COPY.checkout.pasarela;

type Props = {
  total: number;
  alCompletar: () => void;
};

/**
 * Redirección simulada. En producción este paso se elimina: "Pagar ahora"
 * redirige de verdad a Flow, Webpay o Mercado Pago.
 */
export function PasoPasarela({ total, alCompletar }: Props) {
  useEffect(() => {
    const id = setTimeout(alCompletar, MS_PASARELA);
    return () => clearTimeout(id);
  }, [alCompletar]);

  /* alCerrar en null: la pasarela no se puede cerrar, tampoco con Escape. */
  return (
    <Modal aria={copy.aria} alCerrar={null} estrecho>
      <div className={estilos.pasarela}>
        <div className={estilos.spinner} aria-hidden="true" />
        <h2 className={estilos.tituloPasarela}>{copy.titulo}</h2>
        <p className={estilos.totalPasarela}>{clp(total)}</p>

        <p className={estilos.nota}>
          <strong className={estilos.notaTitulo}>{copy.notaTitulo}</strong>
          {copy.notaTexto}
        </p>
      </div>
    </Modal>
  );
}
