'use client';

import type { Carrito } from '@/hooks/useCarrito';
import { COPY } from '@/lib/copy';
import { Modal } from './Modal';
import { ResumenLineas } from './ResumenLineas';
import estilos from './Checkout.module.css';

const { mensaje: copy, volver } = COPY.checkout;

export function PasoMensaje({ carrito }: { carrito: Carrito }) {
  const { err } = carrito;

  return (
    <Modal aria={copy.aria} alCerrar={carrito.volver}>
      <p className="kicker">{copy.kicker}</p>
      <h2 className={estilos.titulo}>{copy.titulo}</h2>
      <p className={estilos.texto}>{copy.texto}</p>

      <ResumenLineas
        className={estilos.resumen}
        lineas={carrito.lineas}
        total={carrito.total}
      />

      <div className={estilos.campo}>
        <label className={estilos.label} htmlFor="nombre">
          {copy.campos.nombre}
        </label>
        <input
          id="nombre"
          className={`${estilos.input} ${err.nombre ? estilos.invalido : ''}`}
          autoComplete="name"
          value={carrito.nombre}
          onChange={(e) => carrito.setNombre(e.target.value)}
          aria-invalid={err.nombre ? true : undefined}
          aria-describedby={err.nombre ? 'error-nombre' : undefined}
        />
        {err.nombre && (
          <p id="error-nombre" className={estilos.error}>
            {err.nombre}
          </p>
        )}
      </div>

      <div className={estilos.campo}>
        <label className={estilos.label} htmlFor="correo">
          {copy.campos.correo}
        </label>
        <input
          id="correo"
          type="email"
          className={`${estilos.input} ${err.correo ? estilos.invalido : ''}`}
          autoComplete="email"
          value={carrito.correo}
          onChange={(e) => carrito.setCorreo(e.target.value)}
          aria-invalid={err.correo ? true : undefined}
          aria-describedby={`ayuda-correo${err.correo ? ' error-correo' : ''}`}
        />
        <p id="ayuda-correo" className={estilos.ayuda}>
          {copy.campos.correoAyuda}
        </p>
        {err.correo && (
          <p id="error-correo" className={estilos.error}>
            {err.correo}
          </p>
        )}
      </div>

      <div className={estilos.campo}>
        <label className={estilos.label} htmlFor="mensaje">
          {copy.campos.mensaje}
        </label>
        <textarea
          id="mensaje"
          className={`${estilos.textarea} ${err.mensaje ? estilos.invalido : ''}`}
          value={carrito.mensaje}
          onChange={(e) => carrito.setMensaje(e.target.value)}
          aria-invalid={err.mensaje ? true : undefined}
          aria-describedby={err.mensaje ? 'error-mensaje' : undefined}
        />
        {err.mensaje && (
          <p id="error-mensaje" className={estilos.error}>
            {err.mensaje}
          </p>
        )}
      </div>

      <div className={estilos.botonera}>
        <button
          type="button"
          className={`btn btn-fantasma ${estilos.boton}`}
          onClick={carrito.volver}
        >
          {volver}
        </button>
        <button
          type="button"
          className={`btn btn-primario ${estilos.boton}`}
          onClick={carrito.irAPagar}
        >
          {copy.continuar}
        </button>
      </div>
    </Modal>
  );
}
