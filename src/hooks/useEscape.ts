import { useEffect } from 'react';

/** Llama a `alCerrar` cuando se pulsa Escape, mientras `activo` sea true. */
export function useEscape(activo: boolean, alCerrar: () => void): void {
  useEffect(() => {
    if (!activo) return;

    const alTeclear = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        alCerrar();
      }
    };

    document.addEventListener('keydown', alTeclear);
    return () => document.removeEventListener('keydown', alTeclear);
  }, [activo, alCerrar]);
}
