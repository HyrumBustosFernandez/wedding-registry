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
      {children && <div className={estilos.encima}>{children}</div>}
    </div>
  );
}
