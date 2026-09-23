'use client';

import { useCarrito } from '@/hooks/useCarrito';
import { AporteLibre } from './AporteLibre';
import { BarraCarrito } from './BarraCarrito';
import { useEditando, useEditor } from './editor/EditorContexto';
import { PanelOpciones } from './editor/PanelOpciones';
import { ListaRegalos } from './ListaRegalos';
import { PasoConfirmar } from './PasoConfirmar';
import { PasoListo } from './PasoListo';
import { PasoMensaje } from './PasoMensaje';
import { PasoPasarela } from './PasoPasarela';
import { PieDePagina } from './PieDePagina';

/**
 * Todo lo interactivo del invitado cuelga de acá: la lista comparte estado con
 * el aporte libre, la barra fija y el checkout.
 *
 * En Modo edición el carrito se esconde: quien edita está armando la página, no
 * comprando. Al volver a Vista real vuelve a aparecer.
 */
export function SeccionRegalos() {
  const { contenido } = useEditor();
  const editando = useEditando();
  const carrito = useCarrito(contenido);

  return (
    <>
      <section id="regalos" className="seccion">
        <div className="contenedor">
          <ListaRegalos carrito={carrito} />

          <AporteLibre
            valor={carrito.libreTxt}
            alEscribir={carrito.escribirLibre}
            alFijarTexto={carrito.setLibreTxt}
            alConfirmar={carrito.confirmarLibre}
          />

          <PanelOpciones />

          <PieDePagina />
        </div>
      </section>

      {/* Deja aire bajo la barra fija para que no tape el pie. */}
      <div style={{ height: !editando && carrito.total > 0 ? '7rem' : 0 }} aria-hidden="true" />

      <BarraCarrito
        total={carrito.total}
        cantidadRegalos={carrito.cantidadRegalos}
        visible={!editando && carrito.total > 0 && carrito.paso === null}
        alVaciar={carrito.vaciar}
        alContinuar={carrito.continuar}
      />

      {!editando && carrito.paso === 'mensaje' && <PasoMensaje carrito={carrito} />}
      {!editando && carrito.paso === 'confirmar' && <PasoConfirmar carrito={carrito} />}
      {!editando && carrito.paso === 'pasarela' && carrito.cierre && (
        <PasoPasarela total={carrito.cierre.total} alCompletar={carrito.completarPago} />
      )}
      {!editando && carrito.paso === 'listo' && carrito.cierre && (
        <PasoListo
          nombre={carrito.gracias}
          cierre={carrito.cierre}
          alVolver={carrito.volverALista}
        />
      )}
    </>
  );
}
