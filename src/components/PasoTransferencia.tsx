'use client';

import { useEffect, useRef, useState } from 'react';
import type { Contenido } from '@/contenido/esquema';
import type { Carrito } from '@/hooks/useCarrito';
import { clp } from '@/lib/clp';
import { COPY } from '@/lib/copy';
import { Modal } from './Modal';
import { ResumenLineas } from './ResumenLineas';
import estilos from './Checkout.module.css';

const { transferencia: copy, volver } = COPY.checkout;

type Props = {
  carrito: Carrito;
  pago: Contenido['pago'];
};

/** Copia al portapapeles; si el navegador no deja, cae al método antiguo. */
async function copiarTexto(texto: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(texto);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = texto;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

/**
 * Paso 2: los datos para transferir, cada uno con su botón de copiar, y el
 * aviso "Ya hice mi aporte". Los datos solo aparecen acá, después de elegir
 * cuánto aportar, y no sueltos en la página.
 */
export function PasoTransferencia({ carrito, pago }: Props) {
  const [copiado, setCopiado] = useState<string | null>(null);
  const temporizador = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const { cuenta } = pago;
  const listos = cuenta.numero.trim() !== '';
  const total = clp(carrito.total);

  const filas = [
    { clave: 'titular', etiqueta: copy.campos.titular, valor: cuenta.titular },
    { clave: 'rut', etiqueta: copy.campos.rut, valor: cuenta.rut },
    { clave: 'banco', etiqueta: copy.campos.banco, valor: cuenta.banco },
    { clave: 'tipo', etiqueta: copy.campos.tipo, valor: cuenta.tipo },
    { clave: 'numero', etiqueta: copy.campos.numero, valor: cuenta.numero },
    { clave: 'correo', etiqueta: copy.campos.correo, valor: cuenta.correo },
  ].filter((f) => f.valor.trim() !== '');

  const copiar = async (clave: string, texto: string) => {
    if (!(await copiarTexto(texto))) return;
    setCopiado(clave);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => setCopiado(null), 1800);
  };

  /* Todo junto, en el orden en que lo pide una app de banco chilena. El monto
     va aparte: en el banco se escribe en otro paso, después del destinatario. */
  const todo = filas.map((f) => `${f.etiqueta}: ${f.valor}`).join('\n');

  return (
    <Modal aria={copy.aria} alCerrar={carrito.volver}>
      <p className="kicker">{copy.kicker}</p>
      <h2 className={estilos.titulo}>{copy.titulo}</h2>
      <p className={estilos.texto}>{copy.texto}</p>

      <ResumenLineas className={estilos.resumen} lineas={carrito.lineas} total={carrito.total} />

      {listos ? (
        <>
          {/* El monto va sin puntos ni signo: así se pega limpio en la app del banco. */}
          <div className={estilos.dato}>
            <p className={estilos.datoEtiqueta}>{copy.monto}</p>
            <p className={estilos.datoValor}>{total}</p>
            <button
              type="button"
              className={estilos.copiar}
              onClick={() => copiar('monto', String(carrito.total))}
              aria-label={`${copy.copiar} ${copy.monto.toLowerCase()}`}
            >
              {copiado === 'monto' ? copy.copiado : copy.copiar}
            </button>
          </div>

          {/* Los datos de la cuenta como un solo texto: un toque lo selecciona
              entero, y se pega tal cual al agregar el destinatario. */}
          <p className={estilos.bloqueDatos}>{todo}</p>

          <button
            type="button"
            className={`btn btn-fantasma ${estilos.copiarTodo}`}
            onClick={() => copiar('todo', todo)}
          >
            {copiado === 'todo' ? copy.copiadoTodo : copy.copiarTodo}
          </button>

          {/* Anuncia el "Copiado" a lectores de pantalla sin mover el foco. */}
          <p className="oculto-visual" aria-live="polite">
            {copiado ? copy.copiado : ''}
          </p>
        </>
      ) : (
        <p className={estilos.nota}>
          <strong className={estilos.notaTitulo}>{copy.pendienteTitulo}</strong>
          {copy.pendienteTexto}
        </p>
      )}

      {/* Tenpo como alternativa a la transferencia: entre usuarios de Tenpo
          basta el teléfono. Se copia sin espacios para pegarlo en el buscador
          de la app. */}
      {pago.tenpo && (
        <div className={estilos.tenpo}>
          <p className={estilos.tenpoTitulo}>{copy.tenpo.titulo}</p>
          <p className={estilos.ayuda}>{copy.tenpo.texto}</p>
          <div className={estilos.dato}>
            <p className={estilos.datoEtiqueta}>{copy.tenpo.etiqueta}</p>
            <p className={estilos.datoValor}>{pago.tenpo}</p>
            <button
              type="button"
              className={estilos.copiar}
              onClick={() => copiar('tenpo', pago.tenpo.replace(/\s+/g, ''))}
              aria-label={`${copy.copiar} ${copy.tenpo.etiqueta.toLowerCase()}`}
            >
              {copiado === 'tenpo' ? copy.copiado : copy.copiar}
            </button>
          </div>
        </div>
      )}

      {pago.linkTarjeta && (
        <p className={estilos.tarjeta}>
          <a href={pago.linkTarjeta} target="_blank" rel="noopener noreferrer">
            {copy.tarjeta}
          </a>
          <span className={estilos.ayuda}>{copy.tarjetaAyuda(total)}</span>
        </p>
      )}

      {carrito.errorAviso && (
        <p className={estilos.error} role="alert">
          {carrito.errorAviso}
        </p>
      )}

      <div className={estilos.botonera}>
        <button
          type="button"
          className={`btn btn-fantasma ${estilos.boton}`}
          onClick={carrito.volver}
          disabled={carrito.enviando}
        >
          {volver}
        </button>
        <button
          type="button"
          className={`btn btn-primario ${estilos.boton}`}
          onClick={carrito.avisar}
          disabled={carrito.enviando || (!listos && !pago.linkTarjeta && !pago.tenpo)}
        >
          {carrito.enviando ? copy.enviando : copy.avisar}
        </button>
      </div>
    </Modal>
  );
}
