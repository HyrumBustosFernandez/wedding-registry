'use client';

import { variablesDeTema } from '@/lib/tema';
import { BarraModo } from './editor/BarraModo';
import { useEditor } from './editor/EditorContexto';
import { Encabezado } from './Encabezado';
import { InfoBoda } from './InfoBoda';
import { Portada } from './Portada';
import { SeccionRegalos } from './SeccionRegalos';

/**
 * Raíz de cliente. Vive dentro del EditorProvider para que el tema siga al
 * borrador: cambiar el color de acento en el panel de ajustes se ve al tiro,
 * antes de guardar.
 */
export function Sitio({ hayClave }: { hayClave: boolean }) {
  const { contenido } = useEditor();

  return (
    <div style={variablesDeTema(contenido.opciones)}>
      <Encabezado />
      <BarraModo hayClave={hayClave} />
      <main>
        <Portada />
        <InfoBoda />
        <SeccionRegalos />
      </main>
    </div>
  );
}
