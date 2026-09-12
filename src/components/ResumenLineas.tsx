import type { Linea } from '@/hooks/useCarrito';
import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import estilos from './ResumenLineas.module.css';

type Props = {
  lineas: readonly Linea[];
  total: number;
  className?: string;
};

export function ResumenLineas({ lineas, total, className }: Props) {
  return (
    <div className={[estilos.resumen, className].filter(Boolean).join(' ')}>
      {lineas.map((linea) => (
        <div key={linea.clave} className={estilos.linea}>
          <span>{linea.etiqueta}</span>
          <span className={estilos.monto}>{clp(linea.monto)}</span>
        </div>
      ))}

      <div className={estilos.total}>
        <span>{COPY.checkout.total}</span>
        <span className={estilos.monto}>{clp(total)}</span>
      </div>
    </div>
  );
}
