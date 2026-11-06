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

### Asistencia y avisos de aporte (Google Sheets)

La confirmación de asistencia y el «Ya hice mi aporte» se guardan en una planilla
de Google Sheets, una pestaña para cada uno. Cada aporte avisado además llega por
correo. El código del lado de Google está en `google-apps-script/Codigo.gs`.

1. Crea una planilla en blanco en [sheets.new](https://sheets.new).
2. En la planilla: **Extensiones → Apps Script**. Borra lo que viene, pega todo
   `google-apps-script/Codigo.gs` y guarda.
3. **Implementar → Nueva implementación**, tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
4. Autoriza los permisos que pide (en «Google no verificó esta app» entra a
   *Configuración avanzada → Ir a…*: es tu propio script).
5. Copia la URL que termina en `/exec` y pégala en `registro.url`, dentro de
   `contenido.ts`. Despliega.

Las pestañas *Asistencia* y *Aportes* se crean solas con el primer envío. La
columna «¿Llegó la transferencia?» queda para marcarla a mano al revisar la
cartola: el aviso lo escribe el invitado, no prueba el pago.

Si cambias el script, publica la nueva versión en **Implementar → Gestionar
implementaciones → editar → Versión: nueva**; así la URL no cambia.

Sin URL los formularios se ven igual, pero al enviar avisan que todavía no están
conectados.

### Agregar fotos

Las fotos van en **`src/contenido/fotos.ts`** y los archivos en `public/fotos/`:

| Constante | Dónde se ve |
|---|---|
| `FONDO_INICIO` | Banda a sangre completa que abre la página |
| `FONDO_FINAL` | Banda a sangre completa que la cierra |
| `CARRUSEL` | El carrusel de la portada, en orden |
| `FOTOS_REGALOS` | Miniatura de cada regalo, por id |

El carrusel cambia sola cada `SEGUNDOS_POR_FOTO` (7 por defecto) y vuelve a
empezar al llegar al final. Para sumar una foto basta con agregarla al arreglo.

Conviene achicar las imágenes antes de subirlas; las originales de celular
pesan varios MB cada una:

```bash
sips -s format jpeg -s formatOptions 72 -Z 1800 original.jpeg --out public/fotos/galeria-11.jpg
```

Mientras una miniatura de regalo no exista se dibuja el placeholder rayado del
diseño, así que el sitio se ve bien aunque falten.

### Sin configuración

El sitio no necesita variables de entorno ni base de datos (los formularios van a
Google Sheets):
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
