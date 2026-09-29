'use client';

import { useEffect, useRef, useState, type ElementType, type ReactNode } from 'react';
import estilos from './RevelarAlScroll.module.css';

type Props = {
  children: ReactNode;
  /** Retraso en milisegundos, para escalonar varios elementos de una fila. */
  retraso?: number;
  como?: ElementType;
  className?: string;
  id?: string;
};

/**
 * Aparece suavemente la primera vez que el elemento entra en pantalla.
 *
 * Se revela una sola vez: volver a subir no lo esconde de nuevo, que al
 * scrollear de vuelta se sienta como si la página se rearmara resulta molesto.
 */
export function RevelarAlScroll({
  children,
  retraso = 0,
  como: Como = 'div',
  className,
  id,
}: Props) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const nodo = ref.current;
    if (!nodo) return;

    /* El caso de movimiento reducido lo resuelve el CSS, y el de JavaScript
       apagado un <noscript>: así nada acá deja el contenido invisible. */
    let vivo = true;

    const revelar = () => {
      if (!vivo) return;
      vivo = false;
      setVisible(true);
      observador.disconnect();
      window.removeEventListener('scroll', alScrollear);
    };

    const observador = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) revelar();
      },
      /* Se dispara un poco antes de que el borde inferior lo toque, así llega
         ya apareciendo en vez de saltar justo al entrar. */
      { threshold: 0.1, rootMargin: '0px 0px -8% 0px' },
    );

    /*
     * Respaldo para los saltos. El observador solo avisa cuando se cruza un
     * umbral, así que un salto instantáneo —un ancla del menú, arrastrar la
     * barra de scroll de golpe, o el navegador restaurando la posición al
     * recargar— puede pasar de largo un bloque sin despertarlo nunca, y ese
     * bloque quedaría invisible para siempre.
     */
    const alScrollear = () => {
      const caja = nodo.getBoundingClientRect();
      const dentro = caja.top < window.innerHeight && caja.bottom > 0;
      if (dentro || caja.bottom <= 0) revelar();
    };

    observador.observe(nodo);
    window.addEventListener('scroll', alScrollear, { passive: true });

    return () => {
      vivo = false;
      observador.disconnect();
      window.removeEventListener('scroll', alScrollear);
    };
  }, []);

  return (
    <Como
      ref={ref}
      id={id}
      className={[estilos.revelar, visible && estilos.visible, className]
        .filter(Boolean)
        .join(' ')}
      style={retraso ? { transitionDelay: `${retraso}ms` } : undefined}
    >
      {children}
    </Como>
  );
}
