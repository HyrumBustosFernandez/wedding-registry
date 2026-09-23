'use client';

import { useRef, useState, useTransition } from 'react';
import type { Foto } from '@/contenido/esquema';
import { subirFoto } from '@/server/acciones';
import { Foto as MarcoFoto } from '../Foto';
import { useEditando } from './EditorContexto';
import { TextoEditable } from './TextoEditable';
import estilos from './FotoEditable.module.css';

type Props = {
  foto: Foto | null;
  alCambiar: (foto: Foto | null) => void;
  variante: 'grande' | 'mini';
  ratio: string;
  altPorDefecto: string;
  especificacion?: string;
  /** Solo la portada lleva pie de foto. Pasarlo lo vuelve escribible. */
  alCambiarPie?: (pie: string) => void;
  className?: string;
};

/**
 * El marco polaroid de siempre, con los controles de subida encima cuando se
 * está editando. En Vista real es exactamente el mismo componente de antes.
 */
export function FotoEditable({
  foto,
  alCambiar,
  variante,
  ratio,
  altPorDefecto,
  especificacion,
  alCambiarPie,
  className,
}: Props) {
  const editando = useEditando();
  const entrada = useRef<HTMLInputElement>(null);
  const [subiendo, empezarSubida] = useTransition();
  const [error, setError] = useState<string | null>(null);

  /* El pie vive dentro del <figcaption> del marco para no perder su lugar en el
     polaroid; en edición ese mismo nodo es el campo escribible. */
  const pie = alCambiarPie ? (
    <TextoEditable
      valor={foto?.pie ?? ''}
      alCambiar={foto ? alCambiarPie : undefined}
      placeholder="Pie de foto"
    />
  ) : undefined;

  const marco = (
    <MarcoFoto
      className={className}
      variante={variante}
      ratio={ratio}
      src={foto?.url}
      alt={foto?.alt || altPorDefecto}
      especificacion={especificacion}
      pie={alCambiarPie && (foto || editando) ? pie : foto?.pie}
    />
  );

  if (!editando) return marco;

  const subir = (archivo: File) => {
    setError(null);
    const datos = new FormData();
    datos.set('archivo', archivo);

    empezarSubida(async () => {
      const resultado = await subirFoto(datos);
      if (resultado.ok) {
        alCambiar({ url: resultado.url, alt: foto?.alt || altPorDefecto, pie: foto?.pie ?? '' });
      } else {
        setError(resultado.error);
      }
    });
  };

  return (
    <div className={estilos.envoltorio}>
      {marco}

      <div className={estilos.controles}>
        <input
          ref={entrada}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif"
          className="oculto-visual"
          onChange={(e) => {
            const archivo = e.target.files?.[0];
            if (archivo) subir(archivo);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          className={`btn btn-secundario ${estilos.boton}`}
          onClick={() => entrada.current?.click()}
          disabled={subiendo}
        >
          {subiendo ? 'Subiendo…' : foto?.url ? 'Cambiar foto' : 'Subir foto'}
        </button>

        {foto?.url && (
          <button
            type="button"
            className={`btn btn-fantasma ${estilos.boton}`}
            onClick={() => alCambiar(null)}
            disabled={subiendo}
          >
            Quitar
          </button>
        )}
      </div>

      {error && <p className={estilos.error}>{error}</p>}
    </div>
  );
}
