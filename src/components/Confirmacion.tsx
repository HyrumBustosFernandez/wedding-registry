'use client';

import { useState } from 'react';
import type { Contenido } from '@/contenido/esquema';
import estilos from './Confirmacion.module.css';

type Estado = 'inicio' | 'enviando' | 'listo' | 'error';

type Campos = { nombre: string; apellido: string; contacto: string };

const VACIO: Campos = { nombre: '', apellido: '', contacto: '' };

export function Confirmacion({ confirmacion }: { confirmacion: Contenido['confirmacion'] }) {
  const [campos, setCampos] = useState<Campos>(VACIO);
  const [asiste, setAsiste] = useState(true);
  const [estado, setEstado] = useState<Estado>('inicio');
  const [error, setError] = useState<string | null>(null);

  const set = (campo: keyof Campos) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setCampos((c) => ({ ...c, [campo]: e.target.value }));

  const enviar = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!campos.nombre.trim() || !campos.apellido.trim()) {
      setError('Necesitamos tu nombre y tu apellido.');
      return;
    }
    if (!campos.contacto.trim()) {
      setError('Déjanos un correo o un teléfono para poder escribirte.');
      return;
    }
    if (!confirmacion.formspreeId) {
      setError('El formulario todavía no está conectado. Escríbenos directamente, por favor.');
      return;
    }

    setEstado('enviando');
    try {
      const respuesta = await fetch(`https://formspree.io/f/${confirmacion.formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          nombre: campos.nombre.trim(),
          apellido: campos.apellido.trim(),
          contacto: campos.contacto.trim(),
          asiste: asiste ? 'Sí, asistirá' : 'No podrá asistir',
        }),
      });

      if (!respuesta.ok) throw new Error('Formspree respondió con error');
      setEstado('listo');
    } catch {
      setEstado('error');
      setError('No pudimos enviar tu confirmación. Inténtalo de nuevo en un momento.');
    }
  };

  if (estado === 'listo') {
    return (
      <section id="confirmar" className={estilos.panel}>
        <p className={estilos.gracias}>¡Gracias!</p>
        <p className={estilos.textoListo}>
          {asiste
            ? 'Anotamos tu confirmación. Nos vemos el 5 de febrero.'
            : 'Gracias por avisarnos. Te vamos a extrañar.'}
        </p>
      </section>
    );
  }

  return (
    <section id="confirmar" className={estilos.panel}>
      <p className="kicker">{confirmacion.kicker}</p>
      <h2 className={estilos.titulo}>{confirmacion.titulo}</h2>
      <p className={estilos.texto}>{confirmacion.texto}</p>

      <form className={estilos.formulario} onSubmit={enviar} noValidate>
        <div className={estilos.fila}>
          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="rsvp-nombre">
              Nombre
            </label>
            <input
              id="rsvp-nombre"
              className={estilos.input}
              autoComplete="given-name"
              value={campos.nombre}
              onChange={set('nombre')}
            />
          </div>

          <div className={estilos.campo}>
            <label className={estilos.label} htmlFor="rsvp-apellido">
              Apellido
            </label>
            <input
              id="rsvp-apellido"
              className={estilos.input}
              autoComplete="family-name"
              value={campos.apellido}
              onChange={set('apellido')}
            />
          </div>
        </div>

        <div className={estilos.campo}>
          <label className={estilos.label} htmlFor="rsvp-contacto">
            Información de contacto
          </label>
          <input
            id="rsvp-contacto"
            className={estilos.input}
            placeholder="Correo o teléfono"
            value={campos.contacto}
            onChange={set('contacto')}
          />
        </div>

        <label className={estilos.casilla}>
          <input
            type="checkbox"
            checked={asiste}
            onChange={(e) => setAsiste(e.target.checked)}
          />
          <span>
            <strong>Sí, ahí estaré</strong>
            <em className={estilos.ayuda}>
              Si no puedes acompañarnos, deja la casilla sin marcar y avísanos igual.
            </em>
          </span>
        </label>

        {error && <p className={estilos.error}>{error}</p>}

        <button
          type="submit"
          className={`btn btn-primario ${estilos.enviar}`}
          disabled={estado === 'enviando'}
        >
          {estado === 'enviando' ? 'Enviando…' : 'Enviar confirmación'}
        </button>
      </form>
    </section>
  );
}
