# Lista de Regalos — Antonia & Cristóbal

Sitio de boda con lista de regalos de **aporte compartido**: cada regalo se divide en
N partes y varios invitados cubren una parte cada uno.

Implementado a partir de `ESPEC-DISENO.md`, que es la fuente de verdad visual y
funcional. El prototipo original (`Lista de Regalos.dc.html`, runtime propietario de
Claude Design) se reimplementó aquí desde cero — no es una copia literal.

## Stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **CSS Modules** sobre design tokens en `src/styles/tokens.css`
- Sin librerías de UI, sin CSS-in-JS, sin dependencias de estado

## Desarrollo

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # export estático a ./out
npm run typecheck
```

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

## Pendientes antes de producción

- **Fotos reales** (§14 de la espec): 1 foto de portada 1920×1080 y 9 cuadradas ≥400×400.
  Hasta entonces se usa el placeholder rayado.
- **Pasarela de pago real**: el paso `pasarela` es una simulación de 2000 ms. En
  producción "Pagar ahora" redirige a Flow / Webpay / Mercado Pago y el progreso de cada
  regalo viene del backend, no del estado local.
- **Enlace "Cómo llegar"**: apunta a Google Maps de Viña Matetic; confirmar la URL.
- Favicon y OG image.
