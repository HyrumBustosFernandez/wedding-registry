'use client';

import type { Opciones } from '@/contenido/esquema';
import { useEditando, useEditor } from './EditorContexto';
import estilos from './PanelOpciones.module.css';

/**
 * Ajustes de la página que no son texto. Solo se ve en Modo edición: el
 * invitado nunca sabe que existe.
 */
export function PanelOpciones() {
  const editando = useEditando();
  const { contenido, editar } = useEditor();
  if (!editando) return null;

  const set = <K extends keyof Opciones>(campo: K, valor: Opciones[K]) =>
    editar((c) => ({ ...c, opciones: { ...c.opciones, [campo]: valor } }));

  const { opciones } = contenido;

  return (
    <section className={estilos.panel}>
      <p className="kicker">Ajustes de la página</p>
      <h3 className={estilos.titulo}>Solo tú ves esto</h3>

      <label className={estilos.fila}>
        <input
          type="checkbox"
          checked={opciones.mostrarMetas}
          onChange={(e) => set('mostrarMetas', e.target.checked)}
        />
        <span>
          <strong>Metas por regalo</strong>
          <em className={estilos.ayuda}>
            Apagado, cada regalo se aporta voluntariamente, sin barra de progreso ni tope.
            Encendido, vuelven la meta, la barra y el «3 de 6 regalados».
          </em>
        </span>
      </label>

      <label className={estilos.fila}>
        <input
          type="checkbox"
          checked={opciones.mostrarMiniaturas}
          onChange={(e) => set('mostrarMiniaturas', e.target.checked)}
        />
        <span>
          <strong>Miniaturas en la lista</strong>
          <em className={estilos.ayuda}>La foto cuadrada junto a cada regalo.</em>
        </span>
      </label>

      <label className={estilos.fila}>
        <input
          type="checkbox"
          checked={opciones.mostrarNotas}
          onChange={(e) => set('mostrarNotas', e.target.checked)}
        />
        <span>
          <strong>Notas de cada regalo</strong>
          <em className={estilos.ayuda}>La descripción corta bajo el nombre.</em>
        </span>
      </label>

      <div className={estilos.fila}>
        <span>
          <strong>Estilo de las fotos</strong>
          <em className={estilos.ayuda}>Polaroid va inclinada; marco va recta.</em>
        </span>
        <select
          className={estilos.select}
          value={opciones.estiloFoto}
          onChange={(e) => set('estiloFoto', e.target.value as Opciones['estiloFoto'])}
        >
          <option value="polaroid">Polaroid</option>
          <option value="marco">Marco</option>
        </select>
      </div>

      <div className={estilos.fila}>
        <span>
          <strong>Color de acento</strong>
          <em className={estilos.ayuda}>Líneas, ondas y detalles.</em>
        </span>
        <input
          type="color"
          className={estilos.color}
          value={opciones.acento}
          onChange={(e) => set('acento', e.target.value)}
          aria-label="Color de acento"
        />
      </div>
    </section>
  );
}
