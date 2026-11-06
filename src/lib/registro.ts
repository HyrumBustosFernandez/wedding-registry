/**
 * Envía una fila a la planilla de Google Sheets de los novios, a través del
 * Apps Script de `google-apps-script/Codigo.gs`.
 *
 * Va como texto plano a propósito: así el navegador no hace la consulta previa
 * de CORS, que Apps Script no sabe responder. La respuesta sí trae permiso para
 * leerla, y el script contesta `{ ok: true }` solo si guardó la fila.
 */
export type Hoja = 'asistencia' | 'aportes';

export async function registrar(
  url: string,
  hoja: Hoja,
  datos: Record<string, string | number>,
): Promise<void> {
  const respuesta = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' },
    body: JSON.stringify({ hoja, ...datos }),
  });
  const cuerpo: unknown = await respuesta.json().catch(() => null);
  if (!respuesta.ok || (cuerpo as { ok?: boolean } | null)?.ok !== true) {
    throw new Error('La planilla no guardó el registro');
  }
}
