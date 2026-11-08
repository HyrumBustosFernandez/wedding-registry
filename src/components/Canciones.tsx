'use client';

import { useState } from 'react';
import type { Contenido } from '@/contenido/esquema';
import { registrar } from '@/lib/registro';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './Canciones.module.css';

type Estado = 'inicio' | 'enviando' | 'listo';

type Props = {
  canciones: Contenido['canciones'];
  urlRegistro: string;
};

/**
 * "¿Qué canción no puede faltar?": un solo campo que va a la pestaña
 * Canciones de la planilla. Se puede sugerir más de una, así que al terminar
 * vuelve al formulario en vez de cerrarse.
 */
export function Canciones({ canciones, urlRegistro }: Props) {
  const [cancion, setCancion] = useState('');
  const [estado, setEstado] = useState<Estado>('inicio');
  const [error, setError] = useState<string | null>(null);

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!cancion.trim()) {
      setError('Escribe una canción, un álbum o un artista.');
      return;
    }
    if (!urlRegistro) {
      setError('El formulario todavía no está conectado. Escríbenos directamente, por favor.');
      return;
    }

    setEstado('enviando');
    try {
      await registrar(urlRegistro, 'canciones', { cancion: cancion.trim() });
      setEstado('listo');
    } catch {
      setEstado('inicio');
      setError('No pudimos enviar tu canción. Inténtalo de nuevo en un momento.');
    }
  };

  const otra = () => {
    setCancion('');
    setEstado('inicio');
  };

  if (estado === 'listo') {
    return (
      <section id="canciones" className={estilos.panel}>
        <p className={estilos.gracias}>¡Anotada!</p>
        <p className={estilos.textoListo}>Gracias, la sumamos a la lista de la fiesta.</p>
        <button type="button" className={`btn btn-fantasma ${estilos.otra}`} onClick={otra}>
          Sugerir otra
        </button>
      </section>
    );
  }

  return (
    <section id="canciones" className={estilos.panel}>
      <p className="kicker">{canciones.kicker}</p>
      <h2 className={estilos.titulo}>{canciones.titulo}</h2>
      <SubrayadoOndulado className={estilos.onda} />
      <p className={estilos.texto}>{canciones.texto}</p>

      <form className={estilos.formulario} onSubmit={enviar} noValidate>
        <div className={estilos.campo}>
          <label className={estilos.pregunta} htmlFor="cancion">
            {canciones.campo}
          </label>
          <input
            id="cancion"
            className={estilos.input}
            maxLength={200}
            autoComplete="off"
            value={cancion}
            onChange={(e) => setCancion(e.target.value)}
          />
        </div>

        {error && <p className={estilos.error}>{error}</p>}

        <button
          type="submit"
          className={`btn btn-primario ${estilos.enviar}`}
          disabled={estado === 'enviando'}
        >
          {estado === 'enviando' ? 'Enviando…' : canciones.boton}
        </button>
      </form>
    </section>
  );
}
