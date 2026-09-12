/** Formatea un monto en pesos chilenos: 180000 → "$180.000". */
export function clp(monto: number): string {
  return '$' + Number(monto).toLocaleString('es-CL');
}

/** Lee un input de monto libre quedándose solo con los dígitos: "$20.000" → 20000. */
export function parsearMonto(valor: string): number {
  return Number(valor.replace(/\D/g, ''));
}

/**
 * Reformatea el texto de un input de monto en vivo, en cada pulsación.
 * Vacío (o sin dígitos) devuelve string vacío para no dejar un "0" pegado.
 */
export function formatearInputMonto(valor: string): string {
  const digitos = valor.replace(/\D/g, '');
  if (!digitos) return '';
  return Number(digitos).toLocaleString('es-CL');
}
