'use client';

import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import type { Contenido } from '@/contenido/esquema';
import modal from './Modal.module.css';
import estilos from './AvisoPrivacidad.module.css';

type Props = {
  privacidad: Contenido['privacidad'];
};

/**
 * El enlace "Aviso de privacidad" bajo cada formulario y el diálogo que abre.
 *
 * No usa `Modal` porque en el aporte se abre encima del modal del checkout:
 * Escape tiene que cerrar solo este, y al cerrarlo la página tiene que seguir
 * bloqueada. Toma sus estilos para verse igual.
 *
 * Va en un portal a `body`: las secciones que se revelan al hacer scroll usan
 * `transform`, y eso encerraría el fondo fijo dentro de la sección en vez de
 * cubrir la pantalla.
 */
export function AvisoPrivacidad({ privacidad }: Props) {
  const [abierto, setAbierto] = useState(false);
  const enlace = useRef<HTMLButtonElement>(null);
  const cerrar = useRef<HTMLButtonElement>(null);
  const caja = useRef<HTMLDivElement>(null);
  /* Como en `Modal`: el clic cuenta como afuera solo si también empezó afuera. */
  const empezoFuera = useRef(false);

  useEffect(() => {
    if (!abierto) return;

    cerrar.current?.focus();
    const boton = enlace.current;

    /* Solo bloquea el scroll si nadie lo había bloqueado ya. */
    const yaBloqueado = document.body.classList.contains('modal-abierto');
    if (!yaBloqueado) document.body.classList.add('modal-abierto');

    /* En captura sobre window: corre antes que el Escape y la trampa de foco
       del checkout, que escuchan en document, y los detiene ahí. */
    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setAbierto(false);
        return;
      }
      if (e.key !== 'Tab' || !caja.current) return;
      e.stopPropagation();
      const focusables = Array.from(caja.current.querySelectorAll<HTMLElement>('a[href], button'));
      const i = focusables.indexOf(document.activeElement as HTMLElement);
      const siguiente = (i + (e.shiftKey ? -1 : 1) + focusables.length) % focusables.length;
      e.preventDefault();
      focusables[siguiente]?.focus();
    };
    window.addEventListener('keydown', alTeclear, true);

    return () => {
      window.removeEventListener('keydown', alTeclear, true);
      if (!yaBloqueado) document.body.classList.remove('modal-abierto');
      boton?.focus();
    };
  }, [abierto]);

  return (
    <>
      <button
        ref={enlace}
        type="button"
        className={estilos.enlace}
        onClick={() => setAbierto(true)}
      >
        {privacidad.titulo}
      </button>

      {abierto &&
        createPortal(
          <div
            className={`${modal.overlay} ${modal.overlayCentrado}`}
            onMouseDown={(e) => {
              empezoFuera.current = e.target === e.currentTarget;
            }}
            onClick={(e) => {
              if (empezoFuera.current && e.target === e.currentTarget) setAbierto(false);
            }}
          >
            <div
              ref={caja}
              role="dialog"
              aria-modal="true"
              aria-labelledby="aviso-privacidad-titulo"
              className={`${modal.caja} ${modal.cajaEstrecha} ${estilos.caja}`}
            >
              <h2 id="aviso-privacidad-titulo" className={estilos.titulo}>
                {privacidad.titulo}
              </h2>
              <p className={estilos.texto}>
                {privacidad.texto}{' '}
                <a href={`mailto:${privacidad.correo}`}>{privacidad.correo}</a>.
              </p>
              <button
                ref={cerrar}
                type="button"
                className={`btn btn-fantasma ${estilos.cerrar}`}
                onClick={() => setAbierto(false)}
              >
                Cerrar
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
