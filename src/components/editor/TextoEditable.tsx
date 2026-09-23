'use client';

import { useEffect, useRef, type ElementType } from 'react';
import { useEditando } from './EditorContexto';
import estilos from './TextoEditable.module.css';

type Props = {
  valor: string;
  /** Sin esto el texto nunca es editable, aunque el modo esté activo. */
  alCambiar?: (valor: string) => void;
  /** Etiqueta a renderizar: 'p', 'h1', 'span', 'blockquote'… */
  como?: ElementType;
  className?: string;
  /** Permite saltos de línea; con false, Enter confirma en vez de partir. */
  multilinea?: boolean;
  placeholder?: string;
};

/**
 * Un texto del sitio que en Modo edición se escribe en su propio lugar.
 *
 * El nodo va sin controlar (`contentEditable` puro, confirmando en blur): un
 * contentEditable controlado por React reposiciona el cursor al principio en
 * cada tecla.
 */
export function TextoEditable({
  valor,
  alCambiar,
  como: Como = 'span',
  className,
  multilinea = false,
  placeholder = 'Escribe aquí',
}: Props) {
  const editando = useEditando();
  const ref = useRef<HTMLElement>(null);
  const activo = editando && Boolean(alCambiar);

  /* Refleja los cambios que vienen de fuera (descartar, deshacer) sin pisar lo
     que el usuario está escribiendo justo ahora. */
  useEffect(() => {
    const nodo = ref.current;
    if (!nodo || !activo) return;
    if (document.activeElement === nodo) return;
    if (nodo.textContent !== valor) nodo.textContent = valor;
  }, [valor, activo]);

  if (!activo) {
    return <Como className={className}>{valor}</Como>;
  }

  const confirmar = () => {
    const texto = (ref.current?.textContent ?? '').replace(/ /g, ' ').trim();
    if (texto !== valor) alCambiar!(texto);
  };

  return (
    <Como
      ref={ref}
      className={[className, estilos.editable].filter(Boolean).join(' ')}
      contentEditable
      suppressContentEditableWarning
      role="textbox"
      tabIndex={0}
      aria-multiline={multilinea}
      data-placeholder={placeholder}
      onBlur={confirmar}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !multilinea) {
          e.preventDefault();
          (e.target as HTMLElement).blur();
        }
        if (e.key === 'Escape') {
          if (ref.current) ref.current.textContent = valor;
          (e.target as HTMLElement).blur();
        }
      }}
      /* Pegar como texto plano: si no, entra HTML del portapapeles. */
      onPaste={(e: React.ClipboardEvent) => {
        e.preventDefault();
        const texto = e.clipboardData.getData('text/plain');
        document.execCommand('insertText', false, multilinea ? texto : texto.replace(/\s*\n\s*/g, ' '));
      }}
    >
      {valor}
    </Como>
  );
}
