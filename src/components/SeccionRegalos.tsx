'use client';

import { CONFIG } from '@/config';
import { useCarrito } from '@/hooks/useCarrito';
import { AporteLibre } from './AporteLibre';
import { BarraCarrito } from './BarraCarrito';
import { ListaRegalos } from './ListaRegalos';
import { PasoConfirmar } from './PasoConfirmar';
import { PasoListo } from './PasoListo';
import { PasoMensaje } from './PasoMensaje';
import { PasoPasarela } from './PasoPasarela';
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

      <BarraCarrito
        total={carrito.total}
        cantidadRegalos={carrito.cantidadRegalos}
        visible={carrito.total > 0 && carrito.paso === null}
        alVaciar={carrito.vaciar}
        alContinuar={carrito.continuar}
      />

      {carrito.paso === 'mensaje' && <PasoMensaje carrito={carrito} />}
      {carrito.paso === 'confirmar' && <PasoConfirmar carrito={carrito} />}
      {carrito.paso === 'pasarela' && carrito.cierre && (
        <PasoPasarela total={carrito.cierre.total} alCompletar={carrito.completarPago} />
      )}
      {carrito.paso === 'listo' && carrito.cierre && (
        <PasoListo
          nombre={carrito.gracias}
          cierre={carrito.cierre}
          alVolver={carrito.volverALista}
        />
      )}
    </>
  );
}
