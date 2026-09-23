import type { Contenido } from '@/contenido/esquema';
import estilos from './PieDePagina.module.css';

export function PieDePagina({ pie }: { pie: Contenido['pie'] }) {
  return (
    <footer className={estilos.pie}>
      <p className={estilos.despedida}>{pie.despedida}</p>
      <p className={estilos.detalle}>{pie.detalle}</p>
      {pie.correo && (
        <p className={estilos.correo}>
          <a href={`mailto:${pie.correo}`}>{pie.correo}</a>
        </p>
      )}
    </footer>
  );
}
