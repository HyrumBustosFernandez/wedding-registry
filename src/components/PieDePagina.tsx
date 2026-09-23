'use client';

import type { Contenido } from '@/contenido/esquema';
import { useEditando, useEditor } from './editor/EditorContexto';
import { TextoEditable } from './editor/TextoEditable';
import estilos from './PieDePagina.module.css';

export function PieDePagina() {
  const { contenido, editar } = useEditor();
  const editando = useEditando();
  const { pie } = contenido;

  const setPie = (cambio: Partial<Contenido['pie']>) =>
    editar((c) => ({ ...c, pie: { ...c.pie, ...cambio } }));

  return (
    <footer className={estilos.pie}>
      <TextoEditable
        como="p"
        className={estilos.despedida}
        valor={pie.despedida}
        alCambiar={(despedida) => setPie({ despedida })}
        placeholder="Nos vemos pronto"
      />
      <TextoEditable
        como="p"
        className={estilos.detalle}
        valor={pie.detalle}
        alCambiar={(detalle) => setPie({ detalle })}
        placeholder="Nombres · fecha · lugar"
      />
      {(pie.correo || editando) && (
        <p className={estilos.correo}>
          {editando ? (
            <TextoEditable
              valor={pie.correo}
              alCambiar={(correo) => setPie({ correo })}
              placeholder="contacto@ejemplo.cl"
            />
          ) : (
            <a href={`mailto:${pie.correo}`}>{pie.correo}</a>
          )}
        </p>
      )}
    </footer>
  );
}
