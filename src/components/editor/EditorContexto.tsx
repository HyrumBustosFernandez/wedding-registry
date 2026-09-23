'use client';

import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import type { Contenido } from '@/contenido/esquema';
import { guardar } from '@/server/acciones';

export type Modo = 'real' | 'edicion';

type Editor = {
  /** El borrador que se está viendo. En Vista real es lo último guardado. */
  contenido: Contenido;
  modo: Modo;
  /** True si el servidor reconoció la sesión de edición. */
  autorizado: boolean;
  /** Hay cambios sin guardar. */
  sucio: boolean;
  guardando: boolean;
  mensaje: { tipo: 'ok' | 'error'; texto: string } | null;

  /** Edita el borrador. Solo tiene efecto en Modo edición. */
  editar: (cambio: (c: Contenido) => Contenido) => void;
  cambiarModo: (modo: Modo) => void;
  guardarCambios: () => Promise<void>;
  descartar: () => void;
  limpiarMensaje: () => void;
};

const Ctx = createContext<Editor | null>(null);

export function useEditor(): Editor {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useEditor debe usarse dentro de <EditorProvider>');
  return ctx;
}

/**
 * ¿Se puede editar este campo ahora mismo? Atajo para los componentes de
 * presentación, que reciben el mismo árbol en los dos modos.
 */
export function useEditando(): boolean {
  const { modo, autorizado } = useEditor();
  return autorizado && modo === 'edicion';
}

type Props = {
  inicial: Contenido;
  autorizado: boolean;
  children: React.ReactNode;
};

export function EditorProvider({ inicial, autorizado, children }: Props) {
  /* `guardado` es la última versión confirmada por el servidor; `borrador` es
     lo que se está editando. Descartar vuelve de uno al otro. */
  const [guardado, setGuardado] = useState(inicial);
  const [borrador, setBorrador] = useState(inicial);
  const [modo, setModo] = useState<Modo>('real');
  const [guardando, setGuardando] = useState(false);
  const [mensaje, setMensaje] = useState<Editor['mensaje']>(null);

  const sucio = useMemo(
    () => JSON.stringify(borrador) !== JSON.stringify(guardado),
    [borrador, guardado],
  );

  const editar = useCallback(
    (cambio: (c: Contenido) => Contenido) => {
      if (!autorizado) return;
      setBorrador(cambio);
    },
    [autorizado],
  );

  const cambiarModo = useCallback((siguiente: Modo) => {
    setModo(siguiente);
    setMensaje(null);
  }, []);

  const guardarCambios = useCallback(async () => {
    setGuardando(true);
    setMensaje(null);
    const resultado = await guardar(borrador);
    setGuardando(false);

    if (resultado.ok) {
      setGuardado(borrador);
      setMensaje({ tipo: 'ok', texto: 'Cambios guardados.' });
    } else {
      setMensaje({ tipo: 'error', texto: resultado.error });
    }
  }, [borrador]);

  const descartar = useCallback(() => {
    setBorrador(guardado);
    setMensaje(null);
  }, [guardado]);

  const limpiarMensaje = useCallback(() => setMensaje(null), []);

  /* En Vista real se muestra el borrador igual: así el botón "Vista real"
     sirve de previsualización de lo editado antes de guardar. */
  const valor = useMemo<Editor>(
    () => ({
      contenido: borrador,
      modo,
      autorizado,
      sucio,
      guardando,
      mensaje,
      editar,
      cambiarModo,
      guardarCambios,
      descartar,
      limpiarMensaje,
    }),
    [borrador, modo, autorizado, sucio, guardando, mensaje, editar, cambiarModo, guardarCambios, descartar, limpiarMensaje],
  );

  return <Ctx.Provider value={valor}>{children}</Ctx.Provider>;
}
