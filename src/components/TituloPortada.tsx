import type { Contenido } from '@/contenido/esquema';
import estilos from './TituloPortada.module.css';

/**
 * Los nombres que abren la página, en el logo que se eligió para la marca:
 * los nombres en la serif de los títulos y solo la conjunción manuscrita en
 * el acento —el «logo 2» de la prueba de logos—, de corrido en una línea.
 *
 * Van debajo de la foto de apertura, sobre el blanco de la página: el logo
 * se apoya en su propio fondo y no en el cielo de la foto, que cambia de
 * tono, y la foto queda limpia. Sin rótulo encima: el nombre solo es el que
 * tiene que quedar, y «nos casamos» ya lo dice todo lo que sigue.
 */
export function TituloPortada({ contenido }: { contenido: Contenido }) {
  const { pareja } = contenido;

  return (
    <h1 className={estilos.titulo}>
      {pareja.nombreUno}
      <span className={estilos.conjuncion}>{pareja.conjuncion}</span>
      {pareja.nombreDos}
    </h1>
  );
}
