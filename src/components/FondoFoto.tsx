import Image from 'next/image';
import type { Foto } from '@/contenido/esquema';
import estilos from './FondoFoto.module.css';

type Props = {
  foto: Foto;
  /** `inicio` funde hacia abajo; `final` funde hacia arriba. */
  posicion: 'inicio' | 'final';
};

/** Banda de foto a sangre completa que abre y cierra la página. */
export function FondoFoto({ foto, posicion }: Props) {
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
    </div>
  );
}
