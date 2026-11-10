'use client';

import { useCallback, useMemo, useState } from 'react';
import type { Contenido, Regalo } from '@/contenido/esquema';
import { clp, formatearInputMonto, parsearMonto } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { guardarAporte, nuevoIdAporte, type AporteGuardado, type EstadoAporte } from '@/lib/historial';
import { registrar } from '@/lib/registro';
import { validar, type ErroresFormulario } from '@/lib/validacion';

export type Orden = 'original' | 'precio-asc' | 'precio-desc' | 'faltan' | 'nombre-asc';
export type Paso = null | 'mensaje' | 'transferencia' | 'listo';

/** Una fila del resumen: un regalo con sus aportes, o el aporte libre. */
export type Linea = { clave: string; etiqueta: string; monto: number };

export type Cierre = { lineas: Linea[]; total: number };

export function useCarrito(contenido: Contenido) {
  const regalos = contenido.regalos.items;
  const { mostrarMetas } = contenido.opciones;

  const [carro, setCarro] = useState<Record<string, number>>({});
  /* Monto escrito para cada regalo, y su texto en crudo mientras se escribe. */
  const [montos, setMontos] = useState<Record<string, number>>({});
  const [montosTxt, setMontosTxt] = useState<Record<string, string>>({});
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
  const [enviando, setEnviando] = useState(false);
  const [errorAviso, setErrorAviso] = useState<string | null>(null);
  /* El aporte en curso dentro de la copia local: el mismo id va de
     "pendiente" a "realizado", y retomar uno sigue con su id. */
  const [idAporte, setIdAporte] = useState<string | null>(null);

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
    const filas: Linea[] = [];

    for (const r of regalos) {
      /* Un regalo suma por una vía o por la otra: el monto escrito en la
         rejilla, o las partes del control de metas. Nunca por las dos. */
      const monto = montos[r.id] ?? 0;
      if (monto > 0) {
        filas.push({ clave: r.id, etiqueta: r.nombre, monto });
        continue;
      }
      const n = carro[r.id] ?? 0;
      if (n > 0) {
        filas.push({
          clave: r.id,
          /* Sin metas, aportar una sola vez no necesita el "× 1". */
          etiqueta: n > 1 ? `${r.nombre} × ${n}` : r.nombre,
          monto: r.precio * n,
        });
      }
    }

    if (libre > 0) {
      filas.push({ clave: 'libre', etiqueta: contenido.libre.titulo, monto: libre });
    }

    return filas;
  }, [regalos, carro, montos, libre, contenido.libre.titulo]);

  const total = useMemo(() => lineas.reduce((suma, l) => suma + l.monto, 0), [lineas]);

  const cantidadRegalos = useMemo(
    () => lineas.filter((l) => l.clave !== 'libre').length,
    [lineas],
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

  /** Lo que se escribe en la casilla de un regalo de la rejilla. */
  const escribirMonto = useCallback((id: string, valor: string) => {
    setMontosTxt((t) => ({ ...t, [id]: formatearInputMonto(valor) }));
  }, []);

  /** Fija el aporte de un regalo. Reemplaza el anterior; nunca acumula. */
  const confirmarMonto = useCallback((id: string) => {
    setMontos((m) => {
      const monto = parsearMonto(montosTxt[id] ?? '');
      const siguiente = { ...m };
      if (monto > 0) siguiente[id] = monto;
      else delete siguiente[id];
      return siguiente;
    });
  }, [montosTxt]);

  /** Saca un regalo del carrito, venga por monto o por partes. */
  const quitarRegalo = useCallback((id: string) => {
    setMontos((m) => {
      const siguiente = { ...m };
      delete siguiente[id];
      return siguiente;
    });
    setMontosTxt((t) => ({ ...t, [id]: '' }));
    setCarro((c) => {
      const siguiente = { ...c };
      delete siguiente[id];
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
    setMontos({});
    setMontosTxt({});
    setLibre(0);
    setLibreTxt('');
  }, []);

  /* ---- máquina de estados del checkout ---- */

  const continuar = useCallback(() => {
    if (total > 0) setPaso('mensaje');
  }, [total]);

  /** Lo que queda en la copia local del dispositivo, tal como está ahora. */
  const instantanea = useCallback(
    (id: string, estado: EstadoAporte): AporteGuardado => ({
      id,
      fecha: new Date().toISOString(),
      estado,
      lineas,
      total,
      nombre: nombre.trim(),
      correo: correo.trim(),
      mensaje: mensaje.trim(),
      carro,
      montos,
      libre,
    }),
    [lineas, total, nombre, correo, mensaje, carro, montos, libre],
  );

  const irATransferir = useCallback(() => {
    const errores = validar({ nombre, correo, mensaje });
    setErr(errores);
    if (Object.keys(errores).length === 0) {
      /* Al ver los datos para transferir ya queda registrado como pendiente:
         si la página se cierra antes de avisar, al volver se puede retomar. */
      const id = idAporte ?? nuevoIdAporte();
      setIdAporte(id);
      guardarAporte(instantanea(id, 'pendiente'));
      setErrorAviso(null);
      setPaso('transferencia');
    }
  }, [nombre, correo, mensaje, idAporte, instantanea]);

  /** Vuelve a abrir un aporte pendiente de la copia local, tal como quedó. */
  const retomar = useCallback((a: AporteGuardado) => {
    const aTexto = (n: number) => formatearInputMonto(String(n));
    setCarro(a.carro);
    setMontos(a.montos);
    setMontosTxt(Object.fromEntries(Object.entries(a.montos).map(([id, n]) => [id, aTexto(n)])));
    setLibre(a.libre);
    setLibreTxt(a.libre > 0 ? aTexto(a.libre) : '');
    setNombre(a.nombre);
    setCorreo(a.correo);
    setMensaje(a.mensaje);
    setErr({});
    setErrorAviso(null);
    setIdAporte(a.id);
    setPaso('transferencia');
  }, []);

  /**
   * "Ya hice mi aporte": manda a los novios quién aportó, cuánto y su mensaje.
   * El sitio no puede ver la transferencia; el aviso es lo que les permite
   * cruzarla con la cartola y agradecer.
   */
  const avisar = useCallback(async () => {
    const { url } = contenido.registro;
    const copy = COPY.checkout.transferencia;
    setErrorAviso(null);

    if (!url) {
      setErrorAviso(copy.sinConectar);
      return;
    }

    setEnviando(true);
    try {
      await registrar(url, 'aportes', {
        nombre: nombre.trim(),
        correo: correo.trim(),
        mensaje: mensaje.trim(),
        detalle: lineas.map((l) => `${l.etiqueta}: ${clp(l.monto)}`).join('\n'),
        total,
      });
    } catch {
      setErrorAviso(copy.errorEnvio);
      setEnviando(false);
      return;
    }

    setEnviando(false);
    guardarAporte(instantanea(idAporte ?? nuevoIdAporte(), 'realizado'));
    setIdAporte(null);
    setCierre({ lineas, total });
    setGracias(nombre.trim());

    /* Con metas encendidas, los aportes suman al progreso; sin metas no hay
       progreso que llevar, solo se vacía el carrito. */
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
    setMontos({});
    setMontosTxt({});
    setLibre(0);
    setLibreTxt('');
    setPaso('listo');
  }, [contenido.registro, nombre, correo, mensaje, lineas, total, mostrarMetas, regalos, carro, instantanea, idAporte]);

  const volver = useCallback(() => {
    setErrorAviso(null);
    setPaso((p) => (p === 'transferencia' ? 'mensaje' : null));
  }, []);

  /** Cierra el checkout sin vaciar el carrito ni borrar lo que se escribió. */
  const cerrar = useCallback(() => {
    setErrorAviso(null);
    setPaso(null);
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
    carro, montos, montosTxt, libre, libreTxt, orden, paso, nombre, correo, mensaje, err, gracias, cierre,
    enviando, errorAviso,
    regalosOrdenados, regalados, enCarro, cubierto, lleno, lineas, total, cantidadRegalos,
    mostrarMetas,
    setOrden, setNombre, setCorreo, setMensaje,
    agregar, quitar, escribirMonto, confirmarMonto, quitarRegalo,
    escribirLibre, setLibreTxt, confirmarLibre, vaciar,
    continuar, irATransferir, retomar, avisar, volver, cerrar, volverALista,
  };
}

export type Carrito = ReturnType<typeof useCarrito>;
