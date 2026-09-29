import estilos from './FondoDecorado.module.css';

/**
 * La capa decorativa del fondo: pétalos que flotan y una luz que cruza.
 *
 * Está escrita para costar lo mínimo. Tres reglas la gobiernan:
 *
 * 1. Solo se animan `transform` y `opacity`. Son las dos propiedades que el
 *    navegador resuelve en el compositor, sin rehacer el diseño ni volver a
 *    pintar nada en cada cuadro.
 * 2. Nada lleva `filter: blur()` animado. Un desenfoque sobre un elemento que
 *    se mueve se recalcula en cada cuadro y es lo más caro que se puede pedir;
 *    acá el difuminado viene dentro del degradado, que se pinta una sola vez.
 * 3. Trece elementos en total, en una capa `fixed` que no crece con la página.
 *
 * Con movimiento reducido se queda todo quieto, que era la versión que
 * mostraba la opción 9.
 */

/* Posición, tamaño, giro y ritmo de cada pétalo. Repartidos por los bordes:
   el centro se deja libre para que nunca pasen por detrás del texto. */
const PETALOS = [
  { x: 4, y: 12, t: 13, g: 18, dur: 34, retraso: 0 },
  { x: 91, y: 8, t: 10, g: -32, dur: 41, retraso: -6 },
  { x: 8, y: 47, t: 15, g: 44, dur: 38, retraso: -13 },
  { x: 94, y: 38, t: 11, g: -12, dur: 45, retraso: -21 },
  { x: 3, y: 74, t: 12, g: 27, dur: 36, retraso: -4 },
  { x: 88, y: 66, t: 14, g: -48, dur: 43, retraso: -17 },
  { x: 12, y: 91, t: 10, g: 8, dur: 39, retraso: -27 },
  { x: 82, y: 88, t: 13, g: -25, dur: 47, retraso: -9 },
  { x: 24, y: 4, t: 9, g: 62, dur: 42, retraso: -30 },
  { x: 70, y: 18, t: 12, g: -40, dur: 37, retraso: -15 },
  { x: 18, y: 62, t: 10, g: 35, dur: 44, retraso: -23 },
  { x: 77, y: 52, t: 11, g: -18, dur: 40, retraso: -11 },
];

export function FondoDecorado() {
  return (
    <div className={estilos.capa} aria-hidden="true">
      <span className={estilos.luz} />
      {PETALOS.map((p, i) => (
        <span
          key={i}
          className={estilos.petalo}
          style={
            {
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.t * 0.64}px`,
              height: `${p.t}px`,
              '--giro': `${p.g}deg`,
              '--dur': `${p.dur}s`,
              '--retraso': `${p.retraso}s`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
