import { COPY } from '@/lib/copy';
import estilos from './Encabezado.module.css';

export function Encabezado() {
  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.interior}`}>
        <span className={estilos.pareja}>{COPY.pareja}</span>
        <nav className={estilos.nav}>
          {COPY.nav.map((item) => (
            <a key={item.href} className={estilos.enlace} href={item.href}>
              {item.texto}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
