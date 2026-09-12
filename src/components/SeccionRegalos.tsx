'use client';

import { CONFIG } from '@/config';
import { useCarrito } from '@/hooks/useCarrito';
import { AporteLibre } from './AporteLibre';
import { ListaRegalos } from './ListaRegalos';
import { PieDePagina } from './PieDePagina';

/**
 * Todo lo interactivo cuelga de acá: la lista comparte estado con el aporte
 * libre, la barra fija y el checkout, así que el carrito vive en este nivel.
 */
export function SeccionRegalos() {
  const carrito = useCarrito();

  return (
    <>
      <section id="regalos" className="seccion">
        <div className="contenedor">
          <ListaRegalos
            carrito={carrito}
            mostrarMiniaturas={CONFIG.miniaturas}
            mostrarNotas={CONFIG.notas}
          />

          <AporteLibre
            valor={carrito.libreTxt}
            alEscribir={carrito.escribirLibre}
            alFijarTexto={carrito.setLibreTxt}
            alConfirmar={carrito.confirmarLibre}
          />

          <PieDePagina />
        </div>
      </section>

      {/* Deja aire bajo la barra fija para que no tape el pie (§7.8). */}
      <div style={{ height: carrito.total > 0 ? '7rem' : 0 }} aria-hidden="true" />
    </>
  );
}
