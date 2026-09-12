'use client';

import { useCallback, useMemo, useState } from 'react';
import { REGALOS, type Regalo } from '@/data/regalos';
import { formatearInputMonto, parsearMonto } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { validar, type ErroresFormulario } from '@/lib/validacion';

export type Orden = 'original' | 'precio-asc' | 'precio-desc' | 'faltan' | 'nombre-asc';
export type Paso = null | 'mensaje' | 'confirmar' | 'pasarela' | 'listo';

/** Una fila del resumen: un regalo con sus partes, o el aporte libre. */
export type Linea = { clave: string; etiqueta: string; monto: number };

export type Cierre = { lineas: Linea[]; total: number };

/** Duración de la pasarela simulada. En producción este paso no existe (§9.4). */
export const MS_PASARELA = 2000;

export function useCarrito() {
  const [carro, setCarro] = useState<Record<number, number>>({});
  const [prog, setProg] = useState<Record<number, number>>({});
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
  const lleno = useCallback((r: Regalo) => cubierto(r) >= r.objetivo, [cubierto]);

  const regalosOrdenados = useMemo(() => {
    const lista = [...REGALOS];
    switch (orden) {
      case 'precio-asc':
        return lista.sort((a, b) => a.precio - b.precio);
      case 'precio-desc':
        return lista.sort((a, b) => b.precio - a.precio);
      case 'nombre-asc':
        return lista.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      case 'faltan':
        /* Partes pendientes, sin contar lo que hay en el carrito. */
        return lista.sort(
          (a, b) => b.objetivo - regalados(b) - (a.objetivo - regalados(a)),
        );
      default:
        return lista;
    }
  }, [orden, regalados]);

  const lineas = useMemo<Linea[]>(() => {
    const filas: Linea[] = REGALOS.filter((r) => (carro[r.id] ?? 0) > 0).map((r) => {
      const n = carro[r.id];
      return {
        clave: String(r.id),
        etiqueta: `${r.nombre} × ${n}`,
        monto: r.precio * n,
      };
    });

    if (libre > 0) {
      filas.push({ clave: 'libre', etiqueta: COPY.libre.etiquetaLinea, monto: libre });
    }

    return filas;
  }, [carro, libre]);

  const total = useMemo(() => lineas.reduce((suma, l) => suma + l.monto, 0), [lineas]);

  /** Cuántos regalos distintos hay en el carrito (el aporte libre no cuenta como regalo). */
  const cantidadRegalos = useMemo(
    () => Object.values(carro).filter((n) => n > 0).length,
    [carro],
  );

  /* ---- acciones del carrito ---- */

  const agregar = useCallback(
    (r: Regalo) => {
      /* Invariante: nunca dejar que cubierto supere el objetivo. */
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

  /** Escribe en el input de aporte libre, reformateando en vivo. */
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

  /* ---- máquina de estados del checkout (§9) ---- */

  const continuar = useCallback(() => {
    if (total > 0) setPaso('mensaje');
  }, [total]);

  const irAPagar = useCallback(() => {
    const errores = validar({ nombre, correo, mensaje });
    setErr(errores);
    if (Object.keys(errores).length === 0) setPaso('confirmar');
  }, [nombre, correo, mensaje]);

  /**
   * "Pagar ahora": congela el resumen y entra a la pasarela simulada.
   * En producción acá va el redirect real a la pasarela.
   */
  const pagar = useCallback(() => {
    setCierre({ lineas, total });
    setGracias(nombre.trim());
    setPaso('pasarela');
  }, [lineas, total, nombre]);

  /**
   * Fin de la pasarela: las partes del carrito se suman al progreso real y el
   * carrito queda vacío. El resumen del paso 4 sale del snapshot, no del carrito.
   */
  const completarPago = useCallback(() => {
    setProg((p) => {
      const siguiente = { ...p };
      for (const r of REGALOS) {
        const partes = carro[r.id] ?? 0;
        if (partes > 0) {
          siguiente[r.id] = Math.min(r.objetivo, (p[r.id] ?? r.regalados) + partes);
        }
      }
      return siguiente;
    });
    setCarro({});
    setLibre(0);
    setLibreTxt('');
    setPaso('listo');
  }, [carro]);

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
    /* estado */
    carro,
    libre,
    libreTxt,
    orden,
    paso,
    nombre,
    correo,
    mensaje,
    err,
    gracias,
    cierre,
    /* derivados */
    regalosOrdenados,
    regalados,
    enCarro,
    cubierto,
    lleno,
    lineas,
    total,
    cantidadRegalos,
    /* acciones */
    setOrden,
    setNombre,
    setCorreo,
    setMensaje,
    agregar,
    quitar,
    escribirLibre,
    setLibreTxt,
    confirmarLibre,
    vaciar,
    continuar,
    irAPagar,
    pagar,
    completarPago,
    volver,
    volverALista,
  };
}

export type Carrito = ReturnType<typeof useCarrito>;
