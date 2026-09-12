import { COPY } from '@/lib/copy';
import estilos from './PieDePagina.module.css';

export function PieDePagina() {
  return (
    <footer className={estilos.pie}>
      <p className={estilos.despedida}>{COPY.pie.despedida}</p>
      <p className={estilos.detalle}>{COPY.pie.detalle}</p>
      <p className={estilos.correo}>
        <a href={`mailto:${COPY.pie.correo}`}>{COPY.pie.correo}</a>
      </p>
    </footer>
  );
}
