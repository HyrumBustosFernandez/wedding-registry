import estilos from './FondoDecorado.module.css';

/**
 * La capa decorativa del fondo: pétalos rosados que caen y una luz que cruza.
 *
 * Se priorizó que se vean por sobre que cuesten poco, así que son veintiséis
 * y bien visibles. Aun así, lo único que se anima es `transform` y `opacity`,
 * que el navegador resuelve en el compositor sin rehacer el diseño ni volver
 * a pintar; y nada lleva `filter: blur()`, que sobre algo en movimiento se
 * recalcula en cada cuadro. Cada pétalo son dos capas: una cae en línea recta
 * y la de dentro gira y se mece, para que las dos animaciones no se peleen
 * por la misma propiedad.
 *
 * Con movimiento reducido quedan repartidos y quietos.
 */

/* Tres rosas, del más claro al más hondo, para que no parezcan recortados
   del mismo papel. */
const TONOS = [
  { claro: '#fbdfe2', medio: '#f3c2c8', hondo: '#e59fa8' },
  { claro: '#fde8e6', medio: '#f6cfc9', hondo: '#e8aaa4' },
  { claro: '#f9d6dd', medio: '#eeb0bb', hondo: '#dd8e9c' },
];

const PETALOS = [
  { x: 43.7, tam: 25, giro: -3, dur: 42.3, retraso: -34.1, deriva: -11, op: 0.47, tono: 2, quieto: 73.4 },
  { x: 7.5, tam: 20, giro: -42, dur: 28.9, retraso: -47.0, deriva: -12, op: 0.62, tono: 1, quieto: 60.9 },
  { x: 60.2, tam: 16, giro: 19, dur: 26.5, retraso: -30.6, deriva: -3, op: 0.39, tono: 0, quieto: 56.0 },
  { x: 76.6, tam: 21, giro: -4, dur: 44.9, retraso: -11.3, deriva: -13, op: 0.42, tono: 0, quieto: 61.6 },
  { x: 44.2, tam: 19, giro: -8, dur: 57.9, retraso: -57.8, deriva: -14, op: 0.41, tono: 0, quieto: 48.2 },
  { x: 1.0, tam: 14, giro: -9, dur: 29.4, retraso: -16.9, deriva: -3, op: 0.58, tono: 0, quieto: 21.2 },
  { x: 91.6, tam: 12, giro: 0, dur: 38.0, retraso: -41.1, deriva: 4, op: 0.5, tono: 0, quieto: 72.1 },
  { x: 25.2, tam: 13, giro: -21, dur: 36.6, retraso: -55.9, deriva: -5, op: 0.41, tono: 0, quieto: 3.0 },
  { x: 45.0, tam: 26, giro: -38, dur: 47.8, retraso: -10.9, deriva: -14, op: 0.56, tono: 1, quieto: 59.9 },
  { x: 9.8, tam: 24, giro: -33, dur: 26.0, retraso: -50.1, deriva: 3, op: 0.4, tono: 1, quieto: 91.6 },
  { x: 58.8, tam: 14, giro: -55, dur: 57.7, retraso: -12.4, deriva: 3, op: 0.56, tono: 1, quieto: 76.7 },
  { x: 37.0, tam: 13, giro: -49, dur: 32.7, retraso: -36.9, deriva: -12, op: 0.44, tono: 2, quieto: 42.8 },
  { x: 94.9, tam: 26, giro: 46, dur: 44.4, retraso: -50.3, deriva: -13, op: 0.38, tono: 0, quieto: 75.6 },
  { x: 23.2, tam: 17, giro: -40, dur: 49.7, retraso: -54.5, deriva: -13, op: 0.61, tono: 1, quieto: 56.3 },
  { x: 40.6, tam: 14, giro: -47, dur: 27.2, retraso: -55.8, deriva: -14, op: 0.54, tono: 1, quieto: 39.9 },
  { x: 89.4, tam: 26, giro: -23, dur: 42.6, retraso: -53.9, deriva: -5, op: 0.4, tono: 2, quieto: 60.8 },
  { x: 60.2, tam: 13, giro: -25, dur: 32.8, retraso: -53.1, deriva: -4, op: 0.42, tono: 1, quieto: 24.4 },
  { x: 2.7, tam: 20, giro: -13, dur: 43.0, retraso: -56.4, deriva: -8, op: 0.38, tono: 1, quieto: 90.2 },
  { x: 64.4, tam: 15, giro: 15, dur: 27.1, retraso: -1.0, deriva: 14, op: 0.43, tono: 0, quieto: 3.9 },
  { x: 62.3, tam: 26, giro: -52, dur: 49.4, retraso: -18.5, deriva: -4, op: 0.47, tono: 1, quieto: 68.3 },
  { x: 88.9, tam: 15, giro: 41, dur: 56.8, retraso: -19.8, deriva: -13, op: 0.47, tono: 0, quieto: 80.4 },
  { x: 40.1, tam: 11, giro: 50, dur: 42.0, retraso: -0.8, deriva: 9, op: 0.5, tono: 2, quieto: 8.5 },
  { x: 7.2, tam: 14, giro: -28, dur: 54.2, retraso: -42.2, deriva: 14, op: 0.53, tono: 1, quieto: 41.6 },
  { x: 82.7, tam: 13, giro: 6, dur: 50.0, retraso: -1.7, deriva: -10, op: 0.35, tono: 2, quieto: 12.2 },
  { x: 76.8, tam: 26, giro: -28, dur: 54.7, retraso: -21.3, deriva: -13, op: 0.51, tono: 2, quieto: 17.3 },
  { x: 89.5, tam: 25, giro: 3, dur: 54.5, retraso: -19.0, deriva: 6, op: 0.52, tono: 0, quieto: 81.2 },
];

export function FondoDecorado() {
  return (
    <div className={estilos.capa} aria-hidden="true">
      <span className={estilos.luz} />

      {PETALOS.map((p, i) => {
        const tono = TONOS[p.tono];
        return (
          <span
            key={i}
            className={estilos.petalo}
            style={
              {
                left: `${p.x}%`,
                width: `${Math.round(p.tam * 0.72)}px`,
                height: `${p.tam}px`,
                '--dur': `${p.dur}s`,
                '--retraso': `${p.retraso}s`,
                '--deriva': `${p.deriva}vw`,
                '--quieto': `${p.quieto}%`,
              } as React.CSSProperties
            }
          >
            <span
              className={estilos.forma}
              style={
                {
                  '--giro': `${p.giro}deg`,
                  '--op': p.op,
                  '--rosa-claro': tono.claro,
                  '--rosa': tono.medio,
                  '--rosa-hondo': tono.hondo,
                  '--dur': `${p.dur}s`,
                  '--retraso': `${p.retraso}s`,
                } as React.CSSProperties
              }
            />
          </span>
        );
      })}
    </div>
  );
}
