'use client';

import { nuevoId, type Contenido } from '@/contenido/esquema';
import { DivisorAnillo } from './DivisorAnillo';
import { BotonAgregar, ControlesItem, eliminar, mover, reemplazar } from './editor/ControlesLista';
import { useEditando, useEditor } from './editor/EditorContexto';
import { TextoEditable } from './editor/TextoEditable';
import estilos from './InfoBoda.module.css';

export function InfoBoda() {
  const { contenido, editar } = useEditor();
  const editando = useEditando();
  const { boda } = contenido;

  const setBoda = (cambio: Partial<Contenido['boda']>) =>
    editar((c) => ({ ...c, boda: { ...c.boda, ...cambio } }));

  const setBloques = (bloques: Contenido['boda']['bloques']) => setBoda({ bloques });

  return (
    <section id="boda" className="seccion">
      <div className="contenedor">
        <DivisorAnillo className={estilos.anillo} />

        <TextoEditable
          como="p"
          className="kicker"
          valor={boda.kicker}
          alCambiar={(kicker) => setBoda({ kicker })}
          placeholder="LO QUE NECESITAS SABER"
        />
        <TextoEditable
          como="h2"
          className={estilos.titulo}
          valor={boda.titulo}
          alCambiar={(titulo) => setBoda({ titulo })}
          placeholder="La boda"
        />

        <div className={estilos.grid}>
          {boda.bloques.map((bloque, i) => (
            <div key={bloque.id}>
              <TextoEditable
                como="p"
                className={`kicker ${estilos.bloqueKicker}`}
                valor={bloque.kicker}
                alCambiar={(kicker) => setBloques(reemplazar(boda.bloques, i, { ...bloque, kicker }))}
                placeholder="CEREMONIA"
              />
              <TextoEditable
                como="h3"
                className={estilos.bloqueTitulo}
                valor={bloque.titulo}
                alCambiar={(titulo) => setBloques(reemplazar(boda.bloques, i, { ...bloque, titulo }))}
                placeholder="Lugar"
              />
              <TextoEditable
                como="p"
                className={estilos.bloqueTexto}
                valor={bloque.texto}
                alCambiar={(texto) => setBloques(reemplazar(boda.bloques, i, { ...bloque, texto }))}
                multilinea
                placeholder="Dirección, horario, lo que haga falta"
              />
              <ControlesItem
                etiqueta="bloque"
                indice={i}
                total={boda.bloques.length}
                alSubir={() => setBloques(mover(boda.bloques, i, i - 1))}
                alBajar={() => setBloques(mover(boda.bloques, i, i + 1))}
                alEliminar={() => setBloques(eliminar(boda.bloques, i))}
              />
            </div>
          ))}
        </div>

        <BotonAgregar
          texto="Agregar bloque"
          alAgregar={() =>
            setBloques([
              ...boda.bloques,
              {
                id: nuevoId('bloque'),
                kicker: 'Nuevo',
                titulo: 'Título',
                texto: 'Cuenten acá los detalles.',
              },
            ])
          }
        />

        <div>
          {editando ? (
            <div className={estilos.enlaceEditor}>
              <TextoEditable
                como="span"
                className={estilos.comoLlegar}
                valor={boda.enlace.texto}
                alCambiar={(texto) => setBoda({ enlace: { ...boda.enlace, texto } })}
                placeholder="Cómo llegar"
              />
              <label className={estilos.enlaceCampo}>
                <span className="oculto-visual">Dirección del enlace</span>
                <input
                  type="url"
                  className={estilos.enlaceInput}
                  value={boda.enlace.href}
                  placeholder="https://maps.google.com/…"
                  onChange={(e) => setBoda({ enlace: { ...boda.enlace, href: e.target.value } })}
                />
              </label>
            </div>
          ) : (
            boda.enlace.texto && (
              <a
                className={estilos.comoLlegar}
                href={boda.enlace.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {boda.enlace.texto}
              </a>
            )
          )}
        </div>
      </div>
    </section>
  );
}
