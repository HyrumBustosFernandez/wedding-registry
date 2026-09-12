import Image from 'next/image';
import estilos from './Foto.module.css';

type Props = {
  /** `grande` es el polaroid del hero; `mini` la miniatura cuadrada de la lista. */
  variante: 'grande' | 'mini';
  /** Proporción del interior. El hero va en 16/10, las miniaturas en 1. */
  ratio: string;
  alt: string;
  /** Ruta de la foto real. Sin ella se dibuja el placeholder rayado. */
  src?: string;
  /** Etiqueta mono en la esquina del placeholder, p. ej. "foto principal · 1920×1080". */
  especificacion?: string;
  /** Pie de foto manuscrito. Solo en el hero. */
  pie?: string;
  className?: string;
};

export function Foto({ variante, ratio, alt, src, especificacion, pie, className }: Props) {
  const esGrande = variante === 'grande';

  return (
    <figure
      className={[estilos.figura, esGrande ? estilos.grande : estilos.mini, className]
        .filter(Boolean)
        .join(' ')}
    >
      <div
        className={`${estilos.interior} ${src ? estilos.conFoto : ''}`}
        style={{ aspectRatio: ratio }}
      >
        {src ? (
          <Image className={estilos.imagen} src={src} alt={alt} fill sizes="(max-width: 48rem) 100vw, 44rem" />
        ) : (
          especificacion && <span className={estilos.especificacion}>{especificacion}</span>
        )}
      </div>
      {pie && <figcaption className={estilos.pie}>{pie}</figcaption>}
    </figure>
  );
}
