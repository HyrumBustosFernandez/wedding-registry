import coreWebVitals from 'eslint-config-next/core-web-vitals';
import nextTypescript from 'eslint-config-next/typescript';

/* Next 16 quitó el comando `next lint`: el linting pasa a ESLint directo.
   eslint-config-next ya publica configuración plana, así que se importa tal cual. */
const config = [
  { ignores: ['.next/**', 'out/**', 'node_modules/**'] },
  ...coreWebVitals,
  ...nextTypescript,
];

export default config;
