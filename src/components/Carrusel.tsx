'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { CARRUSEL, SEGUNDOS_POR_FOTO } from '@/contenido/fotos';
import estilos from './Carrusel.module.css';

/**
 * Carrusel de la portada, dentro del marco polaroid.
 *
 * Cambia sola cada `SEGUNDOS_POR_FOTO` y vuelve a empezar al llegar al final.
 * Las fotos se cruzan en fundido en vez de deslizarse: el diseño es quieto y
 * un carrusel que empuja de lado se siente fuera de lugar.
 *
 * El marco toma la forma de cada foto, así ninguna se recorta ni queda con
 * relleno al costado. Lo que cambia es el ancho, no el alto: si cambiara el
 * alto, todo lo que viene debajo se correría cada siete segundos.
 */
export function Carrusel({ className }: { className?: string }) {
  const [actual, setActual] = useState(0);
  const total = CARRUSEL.length;

  useEffect(() => {
    if (total <= 1) return;

    const id = setInterval(() => {
      setActual((i) => (i + 1) % total);
    }, SEGUNDOS_POR_FOTO * 1000);

    return () => clearInterval(id);
  }, [total, actual]);

  if (total === 0) return null;

  const foto = CARRUSEL[actual];
  const proporcion =
    foto.ancho && foto.alto ? `${foto.ancho} / ${foto.alto}` : '4 / 5';

  return (
    <div className={className}>
      <figure className={estilos.marco}>
        <div
          className={estilos.ventana}
          style={{ '--proporcion': proporcion } as React.CSSProperties}
        >
          {CARRUSEL.map((f, i) => (
            <div
              key={f.url}
              className={`${estilos.lamina} ${i === actual ? estilos.activa : ''}`}
              aria-hidden={i !== actual}
            >
              <Image
                className={estilos.imagen}
                src={f.url}
                alt={f.alt}
                fill
                sizes="(max-width: 36rem) 92vw, 34rem"
                /* Las dos primeras pesan para la primera impresión; el resto
                   puede esperar a que el navegador tenga tiempo. */
                priority={i === 0}
                loading={i <= 1 ? 'eager' : 'lazy'}
              />
            </div>
          ))}
        </div>
      </figure>

      {total > 1 && (
        <div className={estilos.puntos} role="group" aria-label="Fotos">
          {CARRUSEL.map((f, i) => (
            <button
              key={f.url}
              type="button"
              className={`${estilos.punto} ${i === actual ? estilos.puntoActivo : ''}`}
              aria-label={`Ver foto ${i + 1} de ${total}`}
              aria-current={i === actual}
              onClick={() => setActual(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
