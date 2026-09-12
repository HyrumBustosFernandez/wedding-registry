import { COPY } from './copy';

export type CamposFormulario = {
  nombre: string;
  correo: string;
  mensaje: string;
};

export type ErroresFormulario = Partial<Record<keyof CamposFormulario, string>>;

const FORMATO_CORREO = /^\S+@\S+\.\S+$/;

/**
 * Reglas del formulario de checkout (§9.3). Se ejecuta al pulsar "Ir a pagar",
 * nunca mientras se escribe.
 */
export function validar(campos: CamposFormulario): ErroresFormulario {
  const err: ErroresFormulario = {};

  if (!campos.nombre.trim()) err.nombre = COPY.errores.nombreVacio;

  if (!campos.correo.trim()) err.correo = COPY.errores.correoVacio;
  else if (!FORMATO_CORREO.test(campos.correo.trim())) err.correo = COPY.errores.correoFormato;

  if (!campos.mensaje.trim()) err.mensaje = COPY.errores.mensajeVacio;

  return err;
}
