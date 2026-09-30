import Image from 'next/image';
import type { ReactNode } from 'react';
import type { Foto } from '@/contenido/esquema';
import estilos from './FondoFoto.module.css';

type Props = {
  foto: Foto;
  /** `inicio` funde hacia abajo; `final` funde hacia arriba. */
  posicion: 'inicio' | 'final';
  /** Contenido que va encima de la foto, apoyado en la parte más clara del velo. */
  children?: ReactNode;
};

/** Banda de foto a sangre completa que abre y cierra la página. */
export function FondoFoto({ foto, posicion, children }: Props) {
  return (
    <div className={`${estilos.banda} ${estilos[posicion]}`}>
      {/* La foto y su velo van juntos en una caja aparte porque la caja lleva
          la máscara que los desvanece, y lo que va encima no debe heredarla. */}
      <div className={estilos.marco}>
        <Image
          className={estilos.imagen}
          src={foto.url}
          alt={foto.alt}
          fill
          sizes="100vw"
          priority={posicion === 'inicio'}
          quality={80}
        />
        <div className={estilos.velo} />
      </div>
      {children && <div className={estilos.encima}>{children}</div>}
    </div>
  );
}
