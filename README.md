# Lista de Regalos — Ailyne y Jose

Sitio de boda con lista de regalos de **aporte compartido**: cada regalo se divide en
N partes y varios invitados cubren una parte cada uno.

Implementado a partir de `ESPEC-DISENO.md`, que es la fuente de verdad visual y
funcional. El prototipo original (`Lista de Regalos.dc.html`, runtime propietario de
Claude Design) se reimplementó aquí desde cero — no es una copia literal.

## Stack

- **Next.js 16** (App Router, Turbopack) + **React 19** + **TypeScript 6**
- **CSS Modules** sobre design tokens en `src/styles/tokens.css`
- Sin librerías de UI, sin CSS-in-JS, sin dependencias de estado

Node **>=20.9** (lo exige Next 16). `.nvmrc` fija 24 para desarrollo y Vercel
lee `engines.node` del `package.json`.

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export estático a ./out
npm run typecheck
npm run lint
```

`npm run lint` invoca ESLint directo (`eslint .`) con `eslint.config.mjs`: Next 16
eliminó el comando `next lint`.

ESLint queda pinneado en 9.x a propósito. Los plugins que arrastra
`eslint-config-next` (`import`, `jsx-a11y`, `react`) todavía no declaran soporte
para ESLint 10, así que subirlo rompe el árbol de dependencias.

## Estructura

```
src/
  styles/     tokens.css (variables), base.css (reset, focus, keyframes)
  data/       regalos.ts — los 9 regalos
  lib/        clp.ts (moneda es-CL), validacion.ts, copy.ts (todo el texto visible)
  hooks/      useCarrito.ts (estado del carrito y checkout), useEscape.ts
  components/ un componente por pieza del diseño + su .module.css
  app/        layout.tsx (fuentes, metadata), page.tsx (composición)
  config.ts   flags de tema: acento, estiloFoto, miniaturas, notas
```

## Configuración

Los flags viven en `src/config.ts` y son props del árbol, no un panel de UI para el
invitado:

| Flag | Default | Efecto |
|---|---|---|
| `acento` | `#B06E6E` | Color de acento (líneas, ondas, barras de progreso) |
| `estiloFoto` | `polaroid` | `polaroid` (rotado, con "mentón") o `marco` (recto) |
| `miniaturas` | `true` | Muestra las miniaturas cuadradas en la lista |
| `notas` | `false` | Muestra la nota descriptiva bajo cada regalo |

## Cómo cambiar el contenido

Todo el texto del sitio vive en **`src/contenido/contenido.ts`**: nombres, fecha,
lugar, los bloques de la boda, la lista de regalos, el correo de contacto. Se
edita el archivo, se guarda y se despliega.

Al final de ese archivo, en `opciones`, están los interruptores:

| Opción | Default | Efecto |
|---|---|---|
| `mostrarMetas` | `false` | Apagado, cada regalo se aporta voluntariamente, sin barra de progreso ni tope. Encendido, vuelven la meta, la barra y el «3 de 6 regalados» |
| `mostrarMiniaturas` | `true` | La foto cuadrada junto a cada regalo |
| `mostrarNotas` | `false` | La nota corta bajo el nombre de cada regalo |
| `estiloFoto` | `polaroid` | `polaroid` va inclinada, `marco` va recta |
| `acento` | `#B06E6E` | Color de líneas, ondas y detalles |

### Agregar fotos

Las fotos van en **`src/contenido/fotos.ts`**:

1. Deja el archivo en `public/fotos/`.
2. Apúntalo en `FOTO_PORTADA` (la de portada) o en `FOTOS_REGALOS`, donde la
   clave es el id del regalo.
3. Despliega.

Mientras una entrada sea `null` se dibuja el placeholder rayado del diseño, así
que el sitio se ve bien aunque falten fotos.

### Sin configuración

El sitio no necesita variables de entorno, base de datos ni servicios externos:
se exporta entero como HTML estático (`output: 'export'`). Basta con desplegar.

## Pendientes antes de producción

- **Fotos reales** (§14 de la espec): 1 foto de portada 1920×1080 y las cuadradas
  ≥400×400 de cada regalo, en `src/contenido/fotos.ts`. Hasta entonces se usa el
  placeholder rayado.
- **Pasarela de pago real**: el paso `pasarela` es una simulación de 2000 ms. En
  producción "Pagar ahora" redirige a Flow / Webpay / Mercado Pago y el progreso de cada
  regalo viene del backend, no del estado local.
- **Enlace "Cómo llegar"**: apunta a Google Maps de Viña Matetic; confirmar la URL.
- Favicon y OG image.
