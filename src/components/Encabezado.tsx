'use client';

import { nombrePareja } from '@/contenido/esquema';
import { COPY } from '@/lib/copy';
import { useEditor } from './editor/EditorContexto';
import estilos from './Encabezado.module.css';

export function Encabezado() {
  const { contenido } = useEditor();

  return (
    <header className={estilos.encabezado}>
      <div className={`contenedor ${estilos.interior}`}>
        {/* Sale de los nombres de la portada: se edita allá, no acá. */}
        <span className={estilos.pareja}>{nombrePareja(contenido)}</span>
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
