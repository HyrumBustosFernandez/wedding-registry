'use client';

import { useActionState, useState } from 'react';
import { entrarAEdicion, salirDeEdicion, type Resultado } from '@/server/acciones';
import { useEditor } from './EditorContexto';
import estilos from './BarraModo.module.css';

const ESTADO_INICIAL: Resultado | null = null;

/**
 * Control de modo. En Vista real la página se ve como la verán los invitados;
 * en Modo edición aparecen los campos escribibles y los botones de sección.
 *
 * Si no hay sesión, pide la clave compartida. Y si no hay clave configurada en
 * el servidor no se muestra nada: para un invitado el sitio es solo el sitio.
 */
export function BarraModo({ hayClave }: { hayClave: boolean }) {
  const editor = useEditor();
  const [pidiendoClave, setPidiendoClave] = useState(false);
  const [estado, accionEntrar, enviando] = useActionState(entrarAEdicion, ESTADO_INICIAL);

  if (!hayClave) return null;

  /* Sin sesión: solo el acceso. */
  if (!editor.autorizado) {
    return (
      <div className={estilos.barra}>
        {pidiendoClave ? (
          <form action={accionEntrar} className={estilos.formulario}>
            <label className="oculto-visual" htmlFor="clave">
              Clave de edición
            </label>
            <input
              id="clave"
              name="clave"
              type="password"
              className={estilos.clave}
              placeholder="Clave de edición"
              autoComplete="current-password"
              autoFocus
            />
            <button type="submit" className={`btn btn-primario ${estilos.boton}`} disabled={enviando}>
              {enviando ? 'Entrando…' : 'Entrar'}
            </button>
            <button
              type="button"
              className={`btn btn-fantasma ${estilos.boton}`}
              onClick={() => setPidiendoClave(false)}
            >
              Cancelar
            </button>
            {estado && !estado.ok && <span className={estilos.error}>{estado.error}</span>}
          </form>
        ) : (
          <button
            type="button"
            className={`btn btn-secundario ${estilos.boton}`}
            onClick={() => setPidiendoClave(true)}
          >
            Editar la página
          </button>
        )}
      </div>
    );
  }

  const enEdicion = editor.modo === 'edicion';

  return (
    <div className={estilos.barra}>
      <div className={estilos.interruptor} role="group" aria-label="Modo de la página">
        <button
          type="button"
          className={`${estilos.mitad} ${!enEdicion ? estilos.activa : ''}`}
          aria-pressed={!enEdicion}
          onClick={() => editor.cambiarModo('real')}
        >
          Vista real
        </button>
        <button
          type="button"
          className={`${estilos.mitad} ${enEdicion ? estilos.activa : ''}`}
          aria-pressed={enEdicion}
          onClick={() => editor.cambiarModo('edicion')}
        >
          Modo edición
        </button>
      </div>

      {editor.sucio && (
        <>
          <button
            type="button"
            className={`btn btn-primario ${estilos.boton}`}
            onClick={editor.guardarCambios}
            disabled={editor.guardando}
          >
            {editor.guardando ? 'Guardando…' : 'Guardar'}
          </button>
          <button
            type="button"
            className={`btn btn-fantasma ${estilos.boton}`}
            onClick={editor.descartar}
            disabled={editor.guardando}
          >
            Descartar
          </button>
          <span className={estilos.estado}>Sin guardar</span>
        </>
      )}

      {editor.mensaje && (
        <span className={editor.mensaje.tipo === 'ok' ? estilos.ok : estilos.error}>
          {editor.mensaje.texto}
        </span>
      )}

      {!editor.sucio && (
        <button
          type="button"
          className={`btn btn-fantasma ${estilos.boton}`}
          onClick={() => salirDeEdicion()}
        >
          Salir
        </button>
      )}
    </div>
  );
}
