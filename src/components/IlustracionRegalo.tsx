import estilos from './IlustracionRegalo.module.css';

/**
 * Dibujos a línea para los regalos que todavía no tienen foto.
 *
 * Son trazos, no fotos de catálogo: una foto de producto sacada de internet
 * rompería el tono del sitio y competiría con las fotos de la pareja, que es
 * justo lo que no queremos de esta sección. Cuando lleguen fotos reales, se
 * registran en `FOTOS_REGALOS` y estas se dejan de usar solas.
 */
const DIBUJOS: Record<string, React.ReactNode> = {
  plancha: (
    <>
      <path d="M18 66 C18 48 32 38 52 38 L78 38 C82 38 84 41 83 45 L79 66 Z" />
      <path d="M18 66 L83 66" />
      <path d="M34 34 C34 24 42 20 52 20 L66 20 C74 20 78 24 78 32" />
      <path d="M28 74 L76 74" />
    </>
  ),
  sillon: (
    <>
      <path d="M22 50 C22 44 26 41 30 43 C34 45 34 50 34 54 L34 66" />
      <path d="M78 50 C78 44 74 41 70 43 C66 45 66 50 66 54 L66 66" />
      <path d="M34 66 L34 56 C34 50 38 47 44 47 L56 47 C62 47 66 50 66 56 L66 66" />
      <path d="M34 47 L34 36 C34 30 38 27 44 27 L56 27 C62 27 66 30 66 36 L66 47" />
      <path d="M28 66 L72 66 L72 72 L28 72 Z" />
      <path d="M34 72 L34 78 M66 72 L66 78" />
    </>
  ),
  sabanas: (
    <>
      <path d="M20 40 C34 32 46 46 60 38 C70 32 76 36 80 40" />
      <path d="M20 52 C34 44 46 58 60 50 C70 44 76 48 80 52" />
      <path d="M20 64 C34 56 46 70 60 62 C70 56 76 60 80 64" />
      <path d="M20 40 L20 68 M80 40 L80 68" />
    </>
  ),
  batidora: (
    <>
      <path d="M30 22 L70 22 C74 22 76 25 75 29 L70 44 L34 44 L29 29 C28 25 30 22 30 22 Z" />
      <path d="M46 44 L46 56 M56 44 L56 56" />
      <path d="M36 56 C36 70 42 78 51 78 C60 78 66 70 66 56 Z" />
      <path d="M26 30 L74 30" />
    </>
  ),
  ollas: (
    <>
      <path d="M22 44 L58 44 L55 72 L25 72 Z" />
      <path d="M18 44 L62 44" />
      <path d="M58 52 C66 52 68 56 68 60 C68 64 66 66 60 66" />
      <path d="M62 30 L82 30 L80 46 L64 46 Z" />
      <path d="M60 30 L84 30" />
      <path d="M38 36 L38 44 M34 32 L42 32" />
    </>
  ),
  lampara: (
    <>
      <path d="M34 20 L66 20 L74 44 L26 44 Z" />
      <path d="M50 44 L50 76" />
      <path d="M34 76 L66 76" />
      <path d="M40 82 L60 82" />
      <path d="M50 76 L50 82" />
    </>
  ),
  aspiradora: (
    <>
      <circle cx="40" cy="62" r="18" />
      <circle cx="40" cy="62" r="7" />
      <path d="M56 54 L74 44 C78 42 80 44 80 48 L80 62 C80 66 78 68 74 66 L58 58" />
      <path d="M24 78 L76 78" />
      <path d="M40 44 L40 30 C40 24 46 22 52 24" />
    </>
  ),
  vajilla: (
    <>
      <circle cx="42" cy="44" r="22" />
      <circle cx="42" cy="44" r="13" />
      <path d="M62 66 C62 58 68 54 74 54 C80 54 84 58 84 64 C84 72 76 78 68 78 L58 78" />
      <path d="M22 78 L58 78" />
    </>
  ),
  tostadora: (
    <>
      <path d="M22 44 C22 38 26 34 34 34 L66 34 C74 34 78 38 78 44 L78 68 C78 72 76 74 72 74 L28 74 C24 74 22 72 22 68 Z" />
      <path d="M34 34 L34 26 M46 34 L46 22 M58 34 L58 26" />
      <path d="M66 62 L72 62" />
      <path d="M28 44 L72 44" />
    </>
  ),
  alfombra: (
    <>
      <path d="M22 36 L78 36 L84 70 L16 70 Z" />
      <path d="M28 44 L74 44 M26 52 L76 52 M24 61 L78 61" />
      <path d="M16 70 L14 78 M84 70 L86 78" />
    </>
  ),
  espejo: (
    <>
      <path d="M34 20 C24 20 22 32 22 44 C22 62 30 74 50 74 C70 74 78 62 78 44 C78 32 76 20 66 20 Z" />
      <path d="M32 34 C32 28 36 26 42 26" />
      <path d="M44 74 L44 82 M56 74 L56 82" />
      <path d="M36 82 L64 82" />
    </>
  ),
  hervidor: (
    <>
      <path d="M28 44 L70 44 L66 74 L32 74 Z" />
      <path d="M70 48 L82 38 L82 30" />
      <path d="M28 44 C22 44 20 40 20 36 C20 30 24 28 30 30" />
      <path d="M40 30 L58 30 L58 44" />
      <path d="M44 24 L54 24" />
    </>
  ),
};

export function IlustracionRegalo({ id }: { id: string }) {
  const dibujo = DIBUJOS[id];
  if (!dibujo) return null;

  return (
    <svg
      className={estilos.dibujo}
      viewBox="0 0 100 100"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dibujo}
    </svg>
  );
}
