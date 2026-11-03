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

  /* El monto va sin puntos ni signo: así se pega limpio en la app del banco. */
  const filas = [
    { clave: 'monto', etiqueta: copy.monto, valor: total, copia: String(carrito.total) },
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

  /* Todo junto, en el orden en que lo pide una app de banco chilena. */
  const todo = filas
    .filter((f) => f.clave !== 'monto')
    .map((f) => `${f.etiqueta}: ${f.valor}`)
    .concat(`${copy.monto}: ${total}`)
    .join('\n');

  return (
    <Modal aria={copy.aria} alCerrar={carrito.volver}>
      <p className="kicker">{copy.kicker}</p>
      <h2 className={estilos.titulo}>{copy.titulo}</h2>
      <p className={estilos.texto}>{copy.texto}</p>

      <ResumenLineas className={estilos.resumen} lineas={carrito.lineas} total={carrito.total} />

      {listos ? (
        <>
          <dl className={estilos.datos}>
            {filas.map((f) => (
              <div key={f.clave} className={estilos.dato}>
                <dt className={estilos.datoEtiqueta}>{f.etiqueta}</dt>
                <dd className={estilos.datoValor}>{f.valor}</dd>
                <button
                  type="button"
                  className={estilos.copiar}
                  onClick={() => copiar(f.clave, f.copia ?? f.valor)}
                  aria-label={`${copy.copiar} ${f.etiqueta.toLowerCase()}`}
                >
                  {copiado === f.clave ? copy.copiado : copy.copiar}
                </button>
              </div>
            ))}
          </dl>

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
          disabled={carrito.enviando || (!listos && !pago.linkTarjeta)}
        >
          {carrito.enviando ? copy.enviando : copy.avisar}
        </button>
      </div>
    </Modal>
  );
}
