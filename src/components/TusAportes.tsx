'use client';

import { useSyncExternalStore } from 'react';
import {
  borrarAportes,
  leerAportes,
  leerAportesServidor,
  quitarAporte,
  suscribirAportes,
  type AporteGuardado,
} from '@/lib/historial';
import { COPY } from '@/lib/copy';
import { ResumenLineas } from './ResumenLineas';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './TusAportes.module.css';

const copy = COPY.tusAportes;

const FECHA = new Intl.DateTimeFormat('es-CL', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

type Props = {
  alRetomar: (aporte: AporteGuardado) => void;
};

/**
 * "Tus aportes": la copia local de lo que este invitado aportó desde este
 * navegador. No aparece hasta que hay algo guardado, así que quien entra por
 * primera vez no la ve.
 */
export function TusAportes({ alRetomar }: Props) {
  /* En el servidor (y en el primer render) la lista va vacía: el
     almacenamiento solo existe en el navegador. */
  const aportes = useSyncExternalStore(suscribirAportes, leerAportes, leerAportesServidor);

  if (aportes.length === 0) return null;

  const borrarTodo = () => {
    if (window.confirm(copy.confirmarBorrar)) borrarAportes();
  };

  return (
    <section id="tus-aportes" className={estilos.panel} aria-labelledby="tus-aportes-titulo">
      <p className="kicker">{copy.kicker}</p>
      <h2 id="tus-aportes-titulo" className={estilos.titulo}>
        {copy.titulo}
      </h2>
      <SubrayadoOndulado className={estilos.onda} />
      <p className={estilos.texto}>{copy.texto}</p>

      <ul className={estilos.lista}>
        {aportes.map((a) => (
          <li key={a.id} className={estilos.aporte}>
            <div className={estilos.cabecera}>
              <time className={estilos.fecha} dateTime={a.fecha}>
                {FECHA.format(new Date(a.fecha))}
              </time>
              <span
                className={`${estilos.estado} ${a.estado === 'realizado' ? estilos.realizado : ''}`}
              >
                {copy.estado[a.estado]}
              </span>
            </div>

            <ResumenLineas className={estilos.resumen} lineas={a.lineas} total={a.total} />

            {a.estado === 'pendiente' && (
              <>
                <p className={estilos.ayuda}>{copy.ayudaPendiente}</p>
                <div className={estilos.acciones}>
                  <button
                    type="button"
                    className={`btn btn-fantasma ${estilos.boton}`}
                    onClick={() => quitarAporte(a.id)}
                  >
                    {copy.descartar}
                  </button>
                  <button
                    type="button"
                    className={`btn btn-primario ${estilos.boton} ${estilos.retomar}`}
                    onClick={() => alRetomar(a)}
                  >
                    {copy.retomar}
                  </button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>

      <button type="button" className={estilos.borrar} onClick={borrarTodo}>
        {copy.borrar}
      </button>
    </section>
  );
}
