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

## Contenido editable

La página tiene dos modos, con un botón para alternar:

- **Vista real** — lo que ven los invitados.
- **Modo edición** — los novios cambian los textos: nombres, fecha, contacto,
  los bloques de la boda y la lista de regalos.

Las fotos **no** son editables: las agrega quien mantiene el repo (ver más
abajo). Así un guardado de los novios nunca las pisa.

Lo que se guarda vive en `src/contenido/esquema.ts`. `src/contenido/semilla.ts`
es el contenido de relleno inicial: se muestra mientras nadie haya guardado, y
sale de `ESPEC-DISENO.md`.

### Cómo se usa

El botón **«Editar la página»** aparece arriba a la derecha y pide la clave
(`EDIT_PASSWORD`). Un invitado sin la clave nunca ve nada de esto. Con la sesión
abierta aparece el interruptor **Vista real / Modo edición**.

En Modo edición:

- **Textos**: se hace clic sobre cualquier texto y se escribe encima. Enter
  confirma, Escape cancela.
- **Listas**: los datos de la portada, los bloques de la boda y los regalos
  tienen botones para subir (↑), bajar (↓) y eliminar (×), más un
  «+ Agregar» al final de cada lista.
- **Ajustes** (al final de la lista de regalos): encender metas por regalo,
  miniaturas, notas, estilo de foto y color de acento.

El pie de la foto de portada sí es texto, así que se edita como cualquier otro.

**Vista real** muestra el borrador tal como lo verán los invitados, sin guardar
todavía: sirve de previsualización. **Guardar** lo publica para todos y
**Descartar** vuelve a lo último guardado.

### Configuración

Copia `.env.example` a `.env.local` y llena las tres variables:

| Variable | Para qué | Si falta |
|---|---|---|
| `DATABASE_URL` | Guardar el contenido (Neon, integración nativa de Vercel) | El sitio anda en solo lectura sobre la semilla |
| `EDIT_PASSWORD` | Clave que abre el Modo edición | El botón de edición no aparece |

En Vercel: **Storage → Neon** crea `DATABASE_URL` (usa el prefijo `DATABASE`
al conectar el proyecto, o la variable sale como `STORAGE_URL`), y
`EDIT_PASSWORD` se agrega a mano en **Settings → Environment Variables**. La
tabla se crea sola en el primer uso.

### Agregar fotos

Las fotos viven en código, en `src/contenido/fotos.ts`:

1. Deja el archivo en `public/fotos/`.
2. Apúntalo en `FOTO_PORTADA` (la de portada) o en `FOTOS_REGALOS`, donde la
   clave es el id del regalo.
3. Despliega.

Mientras una entrada sea `null` se dibuja el placeholder rayado del diseño, así
que el sitio se ve bien aunque falten fotos.

El sitio dejó de ser export estático (`output: 'export'`): el contenido se lee
en cada request y el editor necesita Server Actions.

## Pendientes antes de producción

- **Fotos reales** (§14 de la espec): 1 foto de portada 1920×1080 y las cuadradas
  ≥400×400 de cada regalo, en `src/contenido/fotos.ts`. Hasta entonces se usa el
  placeholder rayado.
- **Pasarela de pago real**: el paso `pasarela` es una simulación de 2000 ms. En
  producción "Pagar ahora" redirige a Flow / Webpay / Mercado Pago y el progreso de cada
  regalo viene del backend, no del estado local.
- **Enlace "Cómo llegar"**: apunta a Google Maps de Viña Matetic; confirmar la URL.
- Favicon y OG image.
