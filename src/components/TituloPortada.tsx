import type { Contenido } from '@/contenido/esquema';
import estilos from './TituloPortada.module.css';

/**
 * El rótulo y los nombres, sobrepuestos a la foto de apertura.
 *
 * Van arriba del todo, sobre el cielo de la foto, que es la franja más clara
 * y la única donde no está la pareja: así el texto se lee y ellos se ven
 * enteros.
 */
export function TituloPortada({ contenido }: { contenido: Contenido }) {
  const { portada, pareja } = contenido;

  return (
    <div className={estilos.titular}>
      <p className={`kicker ${estilos.kicker}`}>{portada.kicker}</p>
      <h1 className={estilos.titulo}>
        {pareja.nombreUno}
        <br />
        <span className={estilos.conjuncion}>{pareja.conjuncion}</span>
        {pareja.nombreDos}
      </h1>
    </div>
  );
}
