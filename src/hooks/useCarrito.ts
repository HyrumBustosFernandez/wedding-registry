'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Contenido, Regalo } from '@/contenido/esquema';
import { formatearInputMonto, parsearMonto } from '@/lib/clp';
import { validar, type ErroresFormulario } from '@/lib/validacion';

export type Orden = 'original' | 'precio-asc' | 'precio-desc' | 'faltan' | 'nombre-asc';
export type Paso = null | 'mensaje' | 'confirmar' | 'pasarela' | 'listo';

/** Una fila del resumen: un regalo con sus aportes, o el aporte libre. */
export type Linea = { clave: string; etiqueta: string; monto: number };

export type Cierre = { lineas: Linea[]; total: number };

/** Duración de la pasarela simulada. En producción este paso no existe. */
export const MS_PASARELA = 2000;

export function useCarrito(contenido: Contenido) {
  const regalos = contenido.regalos.items;
  const { mostrarMetas } = contenido.opciones;

  const [carro, setCarro] = useState<Record<string, number>>({});
  const [prog, setProg] = useState<Record<string, number>>({});
  const [libre, setLibre] = useState(0);
  const [libreTxt, setLibreTxt] = useState('');
  const [orden, setOrden] = useState<Orden>('original');
  const [paso, setPaso] = useState<Paso>(null);
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [err, setErr] = useState<ErroresFormulario>({});
  const [gracias, setGracias] = useState('');
  const [cierre, setCierre] = useState<Cierre | null>(null);

  /* ---- derivados (nunca en estado) ---- */

  const regalados = useCallback((r: Regalo) => prog[r.id] ?? r.regalados, [prog]);
  const enCarro = useCallback((r: Regalo) => carro[r.id] ?? 0, [carro]);
  const cubierto = useCallback((r: Regalo) => regalados(r) + enCarro(r), [regalados, enCarro]);

  /**
   * Sin metas encendidas un regalo nunca se llena: se aporta voluntariamente,
   * cuantas veces se quiera. Con metas vuelve el tope del objetivo.
   */
  const lleno = useCallback(
    (r: Regalo) => mostrarMetas && r.objetivo !== null && cubierto(r) >= r.objetivo,
    [mostrarMetas, cubierto],
  );

  const regalosOrdenados = useMemo(() => {
    const lista = [...regalos];
    switch (orden) {
      case 'precio-asc':
        return lista.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return lista.sort((a, b) => b.precio - a.precio);
      case 'nombre-asc':
        return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      case 'faltan':
        /* Partes pendientes, sin contar el carrito. Solo tiene sentido con metas. */
        return lista.sort(
          (a, b) =>
            (b.objetivo ?? 0) - regalados(b) - ((a.objetivo ?? 0) - regalados(a)),
        );
      default:
        return lista;
    }
  }, [regalos, orden, regalados]);

  const lineas = useMemo<Linea[]>(() => {
    const filas: Linea[] = regalos
      .filter((r) => (carro[r.id] ?? 0) > 0)
      .map((r) => {
        const n = carro[r.id];
        return {
          clave: r.id,
          /* Sin metas, aportar una sola vez no necesita el "× 1". */
          etiqueta: n > 1 ? `${r.nombre} × ${n}` : r.nombre,
          monto: r.precio * n,
        };
      });

    if (libre > 0) {
      filas.push({ clave: 'libre', etiqueta: contenido.libre.titulo, monto: libre });
    }

    return filas;
  }, [regalos, carro, libre, contenido.libre.titulo]);

  const total = useMemo(() => lineas.reduce((suma, l) => suma + l.monto, 0), [lineas]);

  const cantidadRegalos = useMemo(
    () => Object.values(carro).filter((n) => n > 0).length,
    [carro],
  );

  /* ---- acciones del carrito ---- */

  const agregar = useCallback(
    (r: Regalo) => {
      if (lleno(r)) return;
      setCarro((c) => ({ ...c, [r.id]: (c[r.id] ?? 0) + 1 }));
    },
    [lleno],
  );

  const quitar = useCallback((r: Regalo) => {
    setCarro((c) => {
      const n = (c[r.id] ?? 0) - 1;
      const siguiente = { ...c };
      if (n <= 0) delete siguiente[r.id];
      else siguiente[r.id] = n;
      return siguiente;
    });
  }, []);

  const escribirLibre = useCallback((valor: string) => {
    setLibreTxt(formatearInputMonto(valor));
  }, []);

  /** "Agregar aporte" reemplaza el aporte anterior; nunca acumula. */
  const confirmarLibre = useCallback(() => {
    const monto = parsearMonto(libreTxt);
    if (!monto) return;
    setLibre(monto);
  }, [libreTxt]);

  const vaciar = useCallback(() => {
    setCarro({});
    setLibre(0);
    setLibreTxt('');
  }, []);

  /* ---- máquina de estados del checkout ---- */

  const continuar = useCallback(() => {
    if (total > 0) setPaso('mensaje');
  }, [total]);

  const irAPagar = useCallback(() => {
    const errores = validar({ nombre, correo, mensaje });
    setErr(errores);
    if (Object.keys(errores).length === 0) setPaso('confirmar');
  }, [nombre, correo, mensaje]);

  const pagar = useCallback(() => {
    setCierre({ lineas, total });
    setGracias(nombre.trim());
    setPaso('pasarela');
  }, [lineas, total, nombre]);

  /**
   * Fin de la pasarela. Con metas encendidas, los aportes suman al progreso
   * real; sin metas no hay progreso que llevar, solo se vacía el carrito.
   */
  const completarPago = useCallback(() => {
    if (mostrarMetas) {
      setProg((p) => {
        const siguiente = { ...p };
        for (const r of regalos) {
          const partes = carro[r.id] ?? 0;
          if (partes > 0) {
            const base = (p[r.id] ?? r.regalados) + partes;
            siguiente[r.id] = r.objetivo === null ? base : Math.min(r.objetivo, base);
          }
        }
        return siguiente;
      });
    }
    setCarro({});
    setLibre(0);
    setLibreTxt('');
    setPaso('listo');
  }, [mostrarMetas, regalos, carro]);

  const volver = useCallback(() => {
    setPaso((p) => (p === 'confirmar' ? 'mensaje' : null));
  }, []);

  const volverALista = useCallback(() => {
    setPaso(null);
    setCierre(null);
    setNombre('');
    setCorreo('');
    setMensaje('');
    setErr({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return {
    carro, libre, libreTxt, orden, paso, nombre, correo, mensaje, err, gracias, cierre,
    regalosOrdenados, regalados, enCarro, cubierto, lleno, lineas, total, cantidadRegalos,
    mostrarMetas,
    setOrden, setNombre, setCorreo, setMensaje,
    agregar, quitar, escribirLibre, setLibreTxt, confirmarLibre, vaciar,
    continuar, irAPagar, pagar, completarPago, volver, volverALista,
  };
}

export type Carrito = ReturnType<typeof useCarrito>;
