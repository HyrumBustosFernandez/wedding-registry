'use client';

import { useEffect, useRef } from 'react';
import { useEscape } from '@/hooks/useEscape';
import estilos from './Modal.module.css';

const FOCUSABLES =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

type Props = {
  /** aria-label del diálogo; uno distinto por paso. */
  aria: string;
  /** Retroceder un paso. `null` deja el modal sin salida (la pasarela). */
  alCerrar: (() => void) | null;
  /** La pasarela va centrada vertical y en caja estrecha. */
  estrecho?: boolean;
  children: React.ReactNode;
};

export function Modal({ aria, alCerrar, estrecho = false, children }: Props) {
  const caja = useRef<HTMLDivElement>(null);

  useEscape(alCerrar !== null, alCerrar ?? (() => {}));

  /* Enfoca el primer control al abrir y devuelve el foco al cerrar. */
  useEffect(() => {
    const previo = document.activeElement as HTMLElement | null;
    caja.current?.querySelector<HTMLElement>(FOCUSABLES)?.focus();
    return () => previo?.focus?.();
  }, []);

  /* El prototipo no los tenía: bloqueo de scroll del body y focus trap. */
  useEffect(() => {
    document.body.classList.add('modal-abierto');
    return () => document.body.classList.remove('modal-abierto');
  }, []);

  useEffect(() => {
    const atrapar = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !caja.current) return;

      const focusables = Array.from(caja.current.querySelectorAll<HTMLElement>(FOCUSABLES));
      if (focusables.length === 0) return;

      const primero = focusables[0];
      const ultimo = focusables[focusables.length - 1];
      const activo = document.activeElement;

      if (e.shiftKey && (activo === primero || !caja.current.contains(activo))) {
        e.preventDefault();
        ultimo.focus();
      } else if (!e.shiftKey && activo === ultimo) {
        e.preventDefault();
        primero.focus();
      }
    };

    document.addEventListener('keydown', atrapar);
    return () => document.removeEventListener('keydown', atrapar);
  }, []);

  return (
    <div className={`${estilos.overlay} ${estrecho ? estilos.overlayCentrado : ''}`}>
      <div
        ref={caja}
        role="dialog"
        aria-modal="true"
        aria-label={aria}
        className={`${estilos.caja} ${estrecho ? estilos.cajaEstrecha : ''}`}
      >
        {children}
      </div>
    </div>
  );
}
