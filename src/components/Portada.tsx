'use client';

import { nombrePareja, nuevoId, type Contenido } from '@/contenido/esquema';
import { FOTO_PORTADA } from '@/contenido/fotos';
import { COPY } from '@/lib/copy';
import { useEditor } from './editor/EditorContexto';
import { BotonAgregar, ControlesItem, eliminar, mover, reemplazar } from './editor/ControlesLista';
import { TextoEditable } from './editor/TextoEditable';
import { Foto } from './Foto';
import { SubrayadoOndulado } from './SubrayadoOndulado';
import estilos from './Portada.module.css';

export function Portada() {
  const { contenido, editar } = useEditor();
  const { portada, pareja } = contenido;

  const setPortada = (cambio: Partial<Contenido['portada']>) =>
    editar((c) => ({ ...c, portada: { ...c.portada, ...cambio } }));

  const setPareja = (cambio: Partial<Contenido['pareja']>) =>
    editar((c) => ({ ...c, pareja: { ...c.pareja, ...cambio } }));

  const setDatos = (datos: Contenido['portada']['datos']) => setPortada({ datos });

  return (
    <section className={estilos.portada}>
      <TextoEditable
        como="p"
        className="kicker"
        valor={portada.kicker}
        alCambiar={(kicker) => setPortada({ kicker })}
        placeholder="NOS CASAMOS"
      />

      <h1 className={estilos.titulo}>
        <TextoEditable
          valor={pareja.nombreUno}
          alCambiar={(nombreUno) => setPareja({ nombreUno })}
          placeholder="Nombre"
        />
        <br />
        <TextoEditable
          className={estilos.conjuncion}
          valor={pareja.conjuncion}
          alCambiar={(conjuncion) => setPareja({ conjuncion })}
          placeholder="y"
        />
        <TextoEditable
          valor={pareja.nombreDos}
          alCambiar={(nombreDos) => setPareja({ nombreDos })}
          placeholder="Nombre"
        />
      </h1>

      <SubrayadoOndulado className={estilos.onda} />

      <div className={estilos.datos}>
        {portada.datos.map((dato, i) => (
          <div key={dato.id}>
            <TextoEditable
              como="span"
              className="kicker"
              valor={dato.kicker}
              alCambiar={(kicker) => setDatos(reemplazar(portada.datos, i, { ...dato, kicker }))}
              placeholder="TÍTULO"
            />
            <TextoEditable
              como="span"
              className={`${estilos.valor} ${dato.numerico ? estilos.numerico : ''}`}
              valor={dato.valor}
              alCambiar={(valor) => setDatos(reemplazar(portada.datos, i, { ...dato, valor }))}
              placeholder="Dato"
            />
            <ControlesItem
              etiqueta="dato"
              indice={i}
              total={portada.datos.length}
              alSubir={() => setDatos(mover(portada.datos, i, i - 1))}
              alBajar={() => setDatos(mover(portada.datos, i, i + 1))}
              alEliminar={() => setDatos(eliminar(portada.datos, i))}
            />
          </div>
        ))}
      </div>

      <BotonAgregar
        texto="Agregar dato"
        alAgregar={() =>
          setDatos([
            ...portada.datos,
            { id: nuevoId('dato'), kicker: 'Nuevo', valor: 'Por definir', numerico: false },
          ])
        }
      />

      <TextoEditable
        como="blockquote"
        className={estilos.cita}
        valor={portada.cita}
        alCambiar={(cita) => setPortada({ cita })}
        multilinea
        placeholder="Cuéntenles algo de ustedes"
      />

      <TextoEditable
        como="p"
        className={estilos.firma}
        valor={portada.firma}
        alCambiar={(firma) => setPortada({ firma })}
        placeholder="— los dos"
      />

      {/* La foto la pone quien mantiene el repo, en contenido/fotos.ts. El pie
          sí es texto, así que se edita como cualquier otro. */}
      <Foto
        className={estilos.foto}
        variante="grande"
        ratio="16 / 10"
        src={FOTO_PORTADA?.url}
        alt={FOTO_PORTADA?.alt || COPY.foto.altPortada(nombrePareja(contenido))}
        especificacion={COPY.foto.especificacionPortada}
        pie={
          <TextoEditable
            valor={portada.pieFoto}
            alCambiar={(pieFoto) => setPortada({ pieFoto })}
            placeholder="Pie de foto"
          />
        }
      />
    </section>
  );
}
