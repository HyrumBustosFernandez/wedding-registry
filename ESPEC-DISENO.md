# Especificación de diseño — Lista de Regalos de Boda (Antonia & Cristóbal)

> Este documento es la fuente de verdad visual y funcional. El prototipo original
> (`Lista de Regalos.dc.html`, hecho con el runtime propietario de Claude Design:
> plantillas `<x-dc>`, `<sc-for>`, `<sc-if>`, estilos inline) **no está en el repo y no
> se copió literalmente**. El diseño se reimplementó en el stack del proyecto
> (Next.js + React + TypeScript) separando archivos según la estructura de §2.
>
> Fidelidad: **alta (hi-fi)**. Colores, tipografías, tamaños, espaciados y microcopy son
> finales. Respétalos al píxel salvo que se indique lo contrario.

---

## 1. Qué es

Sitio de boda de una pareja chilena con lista de regalos **de aporte compartido**: cada
regalo se divide en N "partes" y varios invitados cubren una parte cada uno. Flujo:
navegar la lista → agregar partes al carrito → barra fija de resumen → checkout de 2
pasos (mensaje + confirmación) → pasarela simulada → pantalla de agradecimiento.

Idioma: **español de Chile**. Moneda: **CLP** formateada `es-CL` (`$180.000`, punto como
separador de miles, sin decimales).

### Principios estéticos (no negociables)
- **Editorial y hecho a mano**, no e-commerce. Sin tarjetas con sombra, sin badges, sin
  gradientes, sin emoji, sin iconos decorativos salvo los dos SVG especificados.
- Separación por **líneas de 1px**, no por cajas. La lista de regalos son filas separadas
  por `border-bottom`, no cards.
- Radios de borde **casi nulos** (`2px` en controles, `3px` en modales). Nada redondeado.
- Fotos con **tratamiento polaroid**: marco blanco, leve rotación, sombra suave, pie de
  foto manuscrito.
- La cursiva manuscrita (Caveat) es un **acento, no un estilo de cuerpo**: solo nombres de
  la pareja, pies de foto, firma, título "Aporte libre" y "¡Gracias!".
- Mobile-first: todo apilado con `flex-wrap`, nunca con media queries de columnas.
  Objetivos táctiles **≥48px**.

---

## 2. Estructura de archivos

```
src/
  styles/
    tokens.css              # variables CSS (§3)
    base.css                # reset, body, focus-visible, keyframes, utilidades
    botones.css             # los tres tipos de botón y sus hovers (§7.5)
  data/
    regalos.ts              # el array de 9 regalos (§6)
  lib/
    clp.ts                  # formateo de moneda + parseo de input numérico
    copy.ts                 # todo el texto visible en español
    validacion.ts           # reglas del formulario (§9.3)
    tema.ts                 # deriva las variables de los flags (§15)
  hooks/
    useCarrito.ts           # estado del carrito, progreso, totales, líneas, checkout
    useEscape.ts            # cerrar modal con Escape
  components/
    Encabezado.tsx          # header sticky
    Portada.tsx             # hero: nombres, subrayado, datos, cita, foto
    Foto.tsx                # marco polaroid reutilizable (hero + miniaturas)
    SubrayadoOndulado.tsx   # SVG onda
    DivisorAnillo.tsx       # SVG círculo
    InfoBoda.tsx            # grid de 4 datos logísticos
    SeccionRegalos.tsx      # raíz cliente: comparte el carrito entre lista/barra/modales
    ListaRegalos.tsx        # cabecera de sección + selector de orden + filas
    FilaRegalo.tsx          # una fila de regalo
    ControlPartes.tsx       # botones − / cantidad / + y botón "Regalar"
    AporteLibre.tsx         # panel de monto libre
    BarraCarrito.tsx        # barra fija inferior
    Modal.tsx               # shell de diálogo (overlay + foco + Escape + trap)
    Checkout.module.css     # estilos compartidos por los cuatro pasos
    PasoMensaje.tsx         # checkout paso 1
    PasoConfirmar.tsx       # checkout paso 2
    PasoPasarela.tsx        # spinner de redirección simulada
    PasoListo.tsx           # agradecimiento
    ResumenLineas.tsx       # tabla líneas + total (se usa en 3 modales)
    PieDePagina.tsx
  config.ts                 # flags (§15)
  app/
    layout.tsx              # fuentes y metadata
    page.tsx                # composición
```

Regla: **todo texto visible en español vive en `lib/copy.ts` o en el componente**, no
hardcodeado dentro de lógica.

---

## 3. Design tokens

Variables CSS en `:root`. **El acento es `#B06E6E` (rosa terracota).** Todos los derivados
salen de ahí.

```css
:root{
  /* superficies */
  --fondo:        #FFFFFF;   /* fondo de página y de modales */
  --panel:        #FAF5F2;   /* panel "Aporte libre" y nota de maqueta */
  --papel:        #F4EAE4;   /* fondo de los placeholders de foto */

  /* tinta */
  --tinta:        #141414;   /* texto principal, botones primarios */
  --tinta-cita:   #2C2724;   /* solo la cita/blockquote del hero */
  --ink-muted:    rgba(20,20,20,.62);  /* TODO texto secundario y microtexto */
  --linea:        rgba(20,20,20,.12);  /* bordes y separadores 1px */

  /* acento */
  --acento:       #B06E6E;   /* líneas, ondas, barras de progreso, detalles */
  --acento-osc:   #905855;   /* texto de acento y enlaces — 5.6:1 sobre blanco */

  /* acento con alpha (precalculado desde #B06E6E) */
  --acento-18:    rgba(176,110,110,.18); /* borde panel Aporte libre */
  --acento-20:    rgba(176,110,110,.20); /* rayas foto grande */
  --acento-22:    rgba(176,110,110,.22); /* rayas miniaturas */
  --acento-35:    rgba(176,110,110,.35); /* borde superior barra carrito */

  /* error */
  --error:        #A8452F;   /* borde de input inválido + texto de error */

  /* geometría */
  --radio-control: 2px;
  --radio-modal:   3px;
  --ancho-max:     62rem;    /* 992px — contenedor de TODAS las secciones */
  --pad-x:         clamp(1.1rem, 5vw, 3.5rem);
  --foto-giro:     -1.1deg;
  --foto-chin:     2.4rem;   /* margen inferior extra del marco polaroid */
}
```

### Notas importantes sobre color
- `--acento-osc` = `#905855`. Es el **único** color de acento permitido para texto
  (contraste 5.65:1 sobre blanco, AA). Nunca uses `--acento` (`#B06E6E`) en texto: da
  ~3.3:1 y falla.
- `--ink-muted` es un solo valor `.62` alpha. El prototipo tenía dos tokens (`--t60` y
  `--t35`) con el mismo valor por una corrección de contraste; acá van colapsados en uno.
  Nada de texto en `.35` alpha.
- Si el acento se hace configurable, deriva el oscuro como
  `color-mix(in srgb, var(--acento) 76%, #2A1206)` y **verifica ≥4.5:1** antes de
  aceptarlo. `lib/tema.ts` hace esa mezcla en TS y avisa por consola en dev si falla.

### Sombras
| Uso | Valor |
|---|---|
| Foto grande (polaroid hero) | `0 1px 2px rgba(20,20,20,.06), 0 18px 44px rgba(20,20,20,.09)` |
| Miniatura polaroid | `0 1px 1px rgba(20,20,20,.05), 0 7px 18px rgba(20,20,20,.06)` |
| Barra de carrito (hacia arriba) | `0 -10px 30px rgba(20,20,20,.07)` |
| Modal | `0 24px 60px rgba(20,20,20,.25)` |

Estas cuatro son las **únicas** sombras del diseño.

---

## 4. Tipografía

Cuatro familias, cargadas con `next/font/google` en `app/layout.tsx`:
Caveat 400/600, EB Garamond 400/500 + itálica 400, Instrument Sans 400/500,
IBM Plex Mono 400.

| Rol | Familia | Uso |
|---|---|---|
| Cuerpo / UI | **Instrument Sans** 400/500, fallback `system-ui, sans-serif` | párrafos, botones, inputs, labels, nav |
| Display | **EB Garamond** 400, fallback `Georgia, serif` | H1, H2, H3, nombres de regalos, precios, totales. **Siempre weight 400**, jamás bold |
| Manuscrita | **Caveat** 400, fallback `cursive` | "Antonia & Cristóbal" del header, "y" del H1, pies de foto, firma, "Aporte libre", "¡Gracias!", "Nos vemos en noviembre" |
| Mono / etiquetas | **IBM Plex Mono** 400 | kickers en mayúsculas, texto de avance, especificación de foto, métodos de pago |

**Base:** `body { font-size:16px; line-height:1.6; -webkit-font-smoothing:antialiased; text-wrap:pretty; }`

### Escala
| Elemento | Tamaño | Detalles |
|---|---|---|
| H1 hero | `clamp(2.9rem, 12vw, 5.6rem)` | Garamond, `line-height:1.02`, `letter-spacing:-.015em` |
| "y" del H1 | `.52em` del H1 | Caveat, `color:var(--acento)`, `vertical-align:.18em`, `padding:0 .1em` |
| H2 de sección | `clamp(2rem, 6.5vw, 2.9rem)` | Garamond, `line-height:1.08` |
| H2 de modal | `clamp(1.7rem, 6vw, 2.1rem)` | Garamond, `line-height:1.1` |
| Cita del hero | `clamp(1.3rem, 4.6vw, 1.72rem)` | Garamond, `line-height:1.42`, color `--tinta-cita`, `max-width:34rem` |
| Nombre de regalo (H3) | `clamp(1.25rem, 4vw, 1.42rem)` | Garamond, `line-height:1.15` |
| Dato logístico | `1.42rem` | Garamond, `line-height:1.2` |
| Precio de fila | `1.35rem` | Garamond, `tabular-nums` |
| Total barra carrito | `1.55rem` | Garamond, `tabular-nums`, `line-height:1.15` |
| Total en modal | `1.3rem` | Garamond, `tabular-nums` |
| Dato del hero (fecha/lugar/hora) | `1.25rem` | Garamond, `tabular-nums` en fecha y hora |
| Kicker mono | `.75rem` | `letter-spacing:.20em` (`.18em` en labels de formulario), mayúsculas, `color:var(--ink-muted)` |
| Texto de avance | `.76rem` | mono, `letter-spacing:.04em` |
| Cuerpo secundario | `.9rem`–`.96rem` | Instrument Sans, `color:var(--ink-muted)` |
| Nav / enlaces header | `.88rem` | |
| Botones | `.9rem`–`.95rem` | |
| Caveat header | `clamp(1.3rem, 5.5vw, 1.6rem)` | |
| Caveat pie de foto | `1.4rem` | |
| Caveat firma | `1.5rem` | |
| Caveat "Aporte libre" | `clamp(2rem, 7vw, 2.7rem)` | `line-height:1`, `color:var(--acento-osc)` |
| Caveat "¡Gracias!" | `clamp(2.6rem, 10vw, 3.6rem)` | `line-height:1`, `color:var(--acento-osc)` |

Usa `font-variant-numeric: tabular-nums` en **todo** número monetario, fecha y hora.

---

## 5. Layout global

- Contenedor de cada sección: `max-width:62rem; margin:0 auto; padding-inline:clamp(1.1rem,5vw,3.5rem)`.
- Secciones separadas por `border-top:1px solid var(--linea)` (no por espacio en blanco solo).
- Padding vertical de sección: `clamp(2.8rem, 8vw, 5rem)`.
- `html { scroll-behavior:smooth; scroll-padding-top:70px; }` — necesario porque el header es sticky.
- `:focus-visible { outline:2px solid var(--acento-osc); outline-offset:2px; }` global.
- Enlaces: `a { color:var(--acento-osc); text-decoration:none }`, `a:hover { color:var(--tinta) }`.
- **Nada de grids de columnas fijas.** Donde hay multi-columna, es
  `grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))` o `flex-wrap:wrap` con
  `flex:1 1 <base>`.

---

## 6. Datos

`data/regalos.ts` — 9 ítems, orden original exacto. `objetivo` = número total de partes;
`regalados` = partes ya cubiertas al cargar (semilla de demo).

| id | nombre | precio | objetivo | regalados |
|---|---|---|---|---|
| 1 | Pasajes a Japón | 180000 | 6 | 2 |
| 2 | Noche en un ryokan | 95000 | 3 | 1 |
| 3 | La cena de aniversario | 60000 | 4 | 4 |
| 4 | Sartenes de fierro | 45000 | 5 | 1 |
| 5 | Clases de coreano | 35000 | 8 | 3 |
| 6 | La mudanza a la casa | 70000 | 4 | 0 |
| 7 | Termas de Chillán | 50000 | 6 | 2 |
| 8 | El limonero del patio | 25000 | 10 | 6 |
| 9 | La cámara del viaje | 220000 | 5 | 1 |

Las notas descriptivas de cada ítem están en el archivo.

**Precio mostrado = precio de UNA parte**, no del total del regalo. El ítem 3 arranca
completo (4/4) a propósito: hay que ver el estado "Completo".

---

## 7. Pantalla principal, sección por sección

### 7.1 Header (sticky)
- `position:sticky; top:0; z-index:30; background:rgba(255,255,255,.94); backdrop-filter:blur(8px); border-bottom:1px solid var(--linea)`.
- Interior: contenedor de 62rem, `padding:.5rem var(--pad-x)`, `display:flex; flex-wrap:wrap; align-items:center; gap:.15rem 1.2rem; min-height:60px`.
- Izquierda: `Antonia & Cristóbal` en Caveat, `color:var(--acento-osc)`, `white-space:nowrap`.
- Derecha: `<nav>` con `margin-left:auto`, `gap:clamp(.9rem,3vw,1.7rem)`, 3 enlaces ancla:
  **La boda** → `#boda`, **Los regalos** → `#regalos`, **Aporte libre** → `#libre`. Color
  `--ink-muted`, hover `--tinta`, `white-space:nowrap`.
- **Responsive sin JS ni media query:** `flex-wrap:wrap` hace que el nav baje a una segunda
  línea en pantallas angostas. No implementes detección de breakpoint ni menú hamburguesa.

### 7.2 Hero / portada
Centrado (`text-align:center`), `padding:clamp(2.8rem,10vw,6.5rem) var(--pad-x) clamp(2.5rem,7vw,4rem)`.

Orden vertical:
1. Kicker mono: **NOS CASAMOS**.
2. H1: `Antonia` / salto de línea / `y` (Caveat, acento) / `Cristóbal`. El "y" está inline
   entre ambos nombres en la segunda línea.
3. **Subrayado ondulado** (§8.1): `margin:1.3rem auto 0; max-width:40vw`.
4. Fila de datos: `flex`, centrada, `gap:clamp(1.6rem,7vw,3rem)`, `max-width:32rem`,
   `margin:clamp(2rem,6vw,2.8rem) auto 0`, `padding-top:1.4rem`, `border-top:1px solid var(--linea)`.
   Tres bloques kicker+valor: FECHA / `21.11.2026`, LUGAR / `Casablanca`, HORA / `17:00`
   (valor: `display:block; margin-top:.25rem`).
5. Cita (`<blockquote>`, sin comillas ni borde): *"Siete años arrendando y por fin tenemos
   casa. Está bastante vacía, pero no queremos tres jugueras. Armamos esta lista con las
   cosas que de verdad vamos a usar y los viajes que llevamos años prometiéndonos."* —
   `margin:clamp(2.4rem,7vw,3.4rem) auto 0; max-width:34rem`.
6. Firma en Caveat: `— los dos, desde el living sin sillón`, `margin-top:1rem`, `color:var(--acento-osc)`.
7. **Foto polaroid grande** (§8.3): `max-width:44rem; margin:clamp(2.6rem,8vw,4.2rem) auto 0`,
   aspecto `16/10`, etiqueta `foto principal · 1920×1080`, pie de foto Caveat
   `La casa nueva, el primer día`.

### 7.3 Sección "La boda" (`id="boda"`)
1. **Divisor anillo** (§8.2) centrado, `margin:0 auto clamp(1.8rem,5vw,2.6rem)`.
2. Kicker: **LO QUE NECESITAS SABER**. H2: **La boda**.
3. Grid: `gap:clamp(1.6rem,4vw,2.4rem) clamp(1.8rem,5vw,3rem); grid-template-columns:repeat(auto-fit,minmax(14rem,1fr))`.
   Cuatro bloques, cada uno = kicker mono en `color:var(--acento-osc)` + título Garamond
   1.42rem + párrafo `.94rem` `line-height:1.55` en `--ink-muted`:

| Kicker | Título | Texto |
|---|---|---|
| CEREMONIA | Viña Matetic | Ruta 66, Valle de Casablanca. Llega 17:00, empezamos 17:30 en punto. |
| FIESTA | Misma viña | Cóctel en la terraza, cena a las 20:00, música hasta que aguanten. |
| VESTIMENTA | Formal de jardín | El pasto es pasto: los tacos aguja se hunden. Trae otro par para bailar. |
| TRASLADO | Bus desde Santiago | Sale 15:00 desde Metro Manquehue, vuelve a las 03:00. Avísanos si lo tomas. |

4. Enlace **Cómo llegar**: `display:inline-block; margin-top:clamp(1.6rem,4vw,2.2rem);
   font-size:.95rem; border-bottom:1px solid var(--acento); padding-bottom:2px`. Apunta a
   Google Maps de Viña Matetic.

### 7.4 Sección "Los regalos" (`id="regalos"`)
**Cabecera** — `flex; flex-wrap:wrap; align-items:flex-end; gap:1.2rem 2rem; margin-bottom:clamp(1.6rem,4vw,2.6rem)`:
- Bloque izquierdo (`flex:1 1 20rem`): kicker **LA LISTA**, H2 **Cosas que sí vamos a usar**,
  párrafo `max-width:40ch`: *"Cada regalo se completa entre varios invitados. Elige cuántas
  partes quieres cubrir."*
- Bloque derecho (`flex:1 1 13rem; max-width:22rem`): label mono **ORDENAR** + `<select id="orden">`
  a ancho completo, `padding:.7rem .9rem; min-height:50px; border:1px solid var(--linea); border-radius:2px`.
  Opciones: `original` → "Orden sugerido" · `precio-asc` → "Precio: menor a mayor" ·
  `precio-desc` → "Precio: mayor a menor" · `faltan` → "Los que más faltan" ·
  `nombre-asc` → "Nombre A–Z".

**Lista** — contenedor con `border-top:1px solid var(--linea)`; cada fila es un `<article>`
con `border-bottom:1px solid var(--linea)`.

#### Fila de regalo — anatomía
`display:flex; flex-wrap:wrap; align-items:center; gap:.9rem 1.1rem; padding:clamp(1.1rem,3vw,1.45rem) 0`.

1. **Miniatura polaroid** (§8.3, opcional vía flag): `flex:0 0 auto; width:clamp(58px,15vw,78px)`,
   marco blanco de `5px`, interior `aspect-ratio:1`.
2. **Bloque de texto** (`flex:1 1 14rem; min-width:0`):
   - H3 con el nombre.
   - *(opcional, oculto por defecto)* nota en `.9rem`, `--ink-muted`, `max-width:46ch`.
   - **Barra de progreso**: contenedor `height:3px; background:var(--linea); max-width:15rem;
     margin-top:.65rem; overflow:hidden`; relleno `height:100%; background:var(--acento);
     width:<pct>%; transition:width .35s ease`. `pct = min(100, round(cubierto/objetivo*100))`.
   - **Texto de avance** mono `.76rem`: `«{cubierto} de {objetivo} regalados»`, o
     **`Completo — gracias`** cuando está lleno. Color: `--acento-osc` si está completo,
     `--ink-muted` si no.
3. **Precio** (`flex:0 0 auto`): Garamond 1.35rem, `tabular-nums`. Color `--tinta`
   normalmente, `--ink-muted` cuando el regalo está completo.
4. **Controles** (`flex:0 0 auto; margin-left:auto; display:flex; align-items:center; gap:.4rem`) — §7.5.

`cubierto = regalados_base + partes_en_carrito`. El progreso y el estado "completo" deben
reflejar en vivo lo que hay en el carrito, **antes** de pagar.

### 7.5 Control de partes
Dos estados mutuamente excluyentes:

**Sin nada en el carrito:** un solo botón — `min-height:48px; padding:0 1.25rem;
border:1px solid var(--linea); border-radius:2px; background:transparent; color:var(--tinta); font-size:.9rem`.
- Texto **Regalar**; si el regalo está completo: texto **Completo**, `disabled`, `opacity:.35`.

**Con partes en el carrito:** stepper `[−] [n] [+]`.
- Botones: **48×48px exactos**, `border:1px solid var(--linea)`, `border-radius:2px`, fondo
  transparente, `font-size:1.2rem; line-height:1`. Glifos: `−` (U+2212, *minus sign*, no
  guion) y `+`.
- Contador: `min-width:2.2rem; text-align:center; tabular-nums; font-size:1rem`.
- `+` se deshabilita (`opacity:.3`) cuando `cubierto >= objetivo`.
- `−` en `n=1` quita el ítem del carrito y vuelve al botón "Regalar".

**Hover de botones secundarios:** `background:var(--tinta); color:#fff; border-color:var(--tinta)`.
Sin transición declarada (instantáneo).
**Hover de botones primarios** (fondo `--tinta`): `opacity:.85`.
**Hover de botones "Volver"/"Vaciar"** (fantasma): solo `border-color:var(--tinta)`.

`aria-label` de los steppers: `Agregar una parte de {nombre}` / `Quitar una parte de {nombre}`.

### 7.6 Panel "Aporte libre" (`id="libre"`)
`margin-top:clamp(2.4rem,6vw,4rem); padding:clamp(1.5rem,5vw,3rem); background:var(--panel);
border:1px solid var(--acento-18)`. Sin border-radius.

- Kicker: **SIN ELEGIR NADA DE LA LISTA**.
- H3 en **Caveat** `clamp(2rem,7vw,2.7rem)`, `color:var(--acento-osc)`: **Aporte libre**.
- Párrafo `max-width:44ch`, `--ink-muted`: *"Si prefieres no elegir, también sirve. Pon el
  monto que quieras y lo usamos en lo que más falte."* (`margin:.8rem 0 1.5rem`)
- **Montos sugeridos** — `role="group" aria-label="Montos sugeridos"`, `flex; gap:.5rem;
  flex-wrap:wrap; margin-bottom:.9rem`. Cuatro botones `flex:1 1 7rem; min-height:50px;
  font-size:.95rem; background:var(--fondo); border:1px solid var(--linea)`: `$20.000`,
  `$30.000`, `$50.000`, `$100.000`.
  → **Al hacer clic solo rellenan el input**, no agregan nada al total.
- **Fila input + botón** — `flex; gap:.5rem; flex-wrap:wrap`:
  - `<input id="montoLibre" inputmode="numeric" placeholder="Otro monto">`, `flex:1 1 11rem;
    min-height:50px; padding:.7rem .9rem; border:1px solid var(--linea); border-radius:2px`.
    Label visualmente oculta ("Otro monto").
  - Formateo en vivo: quita todo lo que no sea dígito y reformatea con
    `toLocaleString('es-CL')` en cada pulsación. Vacío → string vacío.
  - Botón primario **Agregar aporte**: `flex:1 1 11rem; min-height:50px; background:var(--tinta);
    color:#fff; border:1px solid var(--tinta)`. Al hacer clic, parsea el input y fija el
    aporte libre (reemplaza el anterior, no acumula). Si es 0/vacío, no hace nada.

### 7.7 Pie de página
Dentro de la sección de regalos, `border-top:1px solid var(--linea)`, `text-align:center`,
`padding:clamp(2.4rem,6vw,3.5rem) 0 clamp(2.5rem,7vw,4rem)`, `margin-top:clamp(2.4rem,6vw,3.5rem)`.
- Caveat 1.7rem, `--acento-osc`: **Nos vemos en noviembre**
- `.86rem` en `--ink-muted`: `Antonia & Cristóbal · 21 de noviembre de 2026 · Valle de Casablanca`
- `.86rem`: `hola@antoniaycristobal.cl`

### 7.8 Espaciador de carrito
Al final de la página, un `<div>` cuya altura es **`7rem` cuando el total > 0** y `0` cuando
no. Evita que la barra fija tape el pie de página / el último regalo. **Obligatorio** — no
lo reemplaces por `padding-bottom` permanente.

### 7.9 Barra fija de carrito
`position:fixed; left:0; right:0; bottom:0; z-index:35; background:rgba(255,255,255,.97);
backdrop-filter:blur(8px); border-top:1px solid var(--acento-35); box-shadow:0 -10px 30px rgba(20,20,20,.07)`.
- **Animación:** `transition:transform .28s ease`. Visible (`translateY(0)`) solo si
  `total > 0` **y** no hay ningún modal abierto; si no, `translateY(105%)`. No usar
  `display:none` — la barra se desliza.
- `role="region" aria-label="Tu regalo"`.
- Interior: contenedor 62rem, `padding:.85rem var(--pad-x)`, `flex; align-items:center;
  gap:.6rem 1rem; flex-wrap:wrap`.
- Izquierda (`flex:1 1 9rem`): kicker mono **ESTÁS REGALANDO**; total en Garamond 1.55rem
  con `aria-live="polite"`; línea `.8rem` con `«{n} regalo elegido» / «{n} regalos elegidos»`
  (vacío si no hay nada).
- Derecha (`flex:1 1 15rem; flex; gap:.5rem`): **Vaciar** (fantasma, `flex:0 1 8rem;
  min-height:48px`) y **Continuar** (primario, `flex:1 1 10rem; min-height:48px`).
- "Vaciar" resetea carrito + aporte libre + texto del input. "Continuar" abre el paso 1
  solo si `total > 0`.

---

## 8. Detalles gráficos hechos a mano

### 8.1 Subrayado ondulado
```html
<svg viewBox="0 0 132 10" width="132" height="10" fill="none" stroke="currentColor"
     stroke-width="1.4" stroke-linecap="round" style="color:var(--acento)" aria-hidden="true">
  <path d="M1.5 6.5Q12 .8 22.5 6.5T43.5 6.5T64.5 6.5T85.5 6.5T106.5 6.5T130.5 6.5"/>
</svg>
```
Dos usos: bajo el H1 del hero (`max-width:40vw`) y bajo el "¡Gracias!" del modal final
(`max-width:60%`, `margin:.7rem auto 1.2rem`).

### 8.2 Divisor anillo
```html
<svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor"
     stroke-width="1.3" style="color:var(--acento)" aria-hidden="true">
  <circle cx="11" cy="11" r="6.4"/>
</svg>
```
Un solo anillo, centrado, al inicio de la sección "La boda".

### 8.3 Marco polaroid (componente `Foto`)
Marco: `background:#fff; padding:clamp(8px,1.6vw,14px); padding-bottom:var(--foto-chin);
border:1px solid rgba(20,20,20,.07);` + sombra de foto grande + `transform:rotate(var(--foto-giro))`.

Interior placeholder (hasta que haya fotos reales):
```css
background-color: var(--papel);
background-image: repeating-linear-gradient(135deg, var(--acento-20) 0 5px, transparent 5px 12px);
```
(miniaturas: `var(--acento-22) 0 4px, transparent 4px 9px`, rayas más finas).

Etiqueta de especificación, esquina inferior izquierda del interior: `position:absolute;
left:.7rem; bottom:.6rem`, mono `.75rem`, `letter-spacing:.1em`, mayúsculas, `color:var(--ink-muted)`.

**Cuando lleguen las fotos reales:** el `<img>` reemplaza solo el interior (`object-fit:cover`).
El marco blanco, la rotación, la sombra y el pie de foto en Caveat **se mantienen**. Las
miniaturas de la lista usan el mismo marco con `padding:5px` y **sin** rotación ni pie de foto.

**Variante `marco`** (alternativa a polaroid): `--foto-giro:0deg` y `--foto-chin:.7rem`.
Mismo marco, sin inclinación ni "mentón". Si expones un toggle de estilo de foto, son estas
dos opciones y nada más.

---

## 9. Checkout — máquina de estados

Un solo estado `paso ∈ {null, 'mensaje', 'confirmar', 'pasarela', 'listo'}`. En cada paso
≠ null la barra de carrito se esconde.

```
null ──Continuar (total>0)──▶ mensaje
mensaje ──Ir a pagar (válido)──▶ confirmar     mensaje ──Volver/Esc──▶ null
confirmar ──Pagar ahora──▶ pasarela            confirmar ──Volver/Esc──▶ mensaje
pasarela ──(2000 ms)──▶ listo                  (pasarela NO se puede cerrar)
listo ──Volver a la lista──▶ null + reset total + scroll top suave
```

### Shell de modal (común a los cuatro)
- Overlay: `position:fixed; inset:0; z-index:50; background:rgba(20,20,20,.55); display:grid;
  place-items:start center; padding:clamp(1rem,4vw,2.5rem); overflow-y:auto`.
  (`place-items:center` solo en "pasarela".)
- Caja: `background:var(--fondo); border-radius:3px; width:100%; max-width:33rem;
  padding:clamp(1.5rem,5vw,2.6rem); margin:auto 0;` + sombra de modal. `max-width:25rem` en "pasarela".
- `role="dialog" aria-modal="true"` + `aria-label` por paso: *Déjanos un mensaje* /
  *Confirma tu regalo* / *Conectando con la pasarela* / *Regalo enviado*.
- **Foco:** al abrir, enfoca el primer `input, textarea, button` del diálogo; al cerrar,
  devuelve el foco al elemento que lo abrió. Al llegar a "listo", enfoca su botón.
- **Escape** cierra (retrocede un paso) en todos los pasos **excepto** "pasarela".
- Scroll: `place-items:start center` + `margin:auto 0` es intencional — en móvil el modal
  alto crece hacia abajo y la página scrollea, no se corta. Mantenlo.
- Focus trap y bloqueo de scroll del `body` (el prototipo no los tenía; acá sí).

### 9.1 Paso 1 — "Déjanos un mensaje"
- Kicker mono: **PASO 1 DE 2**. H2 **Déjanos un mensaje**. Párrafo `.96rem` en `--ink-muted`:
  *"Va junto a tu regalo. Es lo primero que vamos a leer."*
- **Resumen de líneas** (§9.5).
- Tres campos, cada uno con `margin-bottom:1rem`, label `.86rem` `margin-bottom:.3rem` en `--ink-muted`:
  - `Tu nombre` — `autocomplete="name"`
  - `Tu correo` — `type="email" autocomplete="email"` + ayuda `.8rem`: *"Solo para el
    comprobante y para agradecerte."*
  - `Tu mensaje` — `<textarea>` `min-height:7rem; resize:vertical`
  - Inputs: `width:100%; font-size:1rem; padding:.75rem .85rem; min-height:48px;
    border:1px solid var(--linea); border-radius:2px; background:transparent`.
- Botonera (`flex; gap:.6rem; flex-wrap:wrap; margin-top:1.5rem`): **Volver** (fantasma,
  `flex:1 1 8rem; min-height:50px`) y **Ir a pagar** (primario, mismas medidas).

### 9.2 Paso 2 — "Confirma tu regalo"
- Kicker **PASO 2 DE 2**, H2 **Confirma tu regalo**, párrafo: *"Te llevamos a un sitio de pago seguro."*
- Resumen de líneas (§9.5).
- Botones **Volver** (→ paso 1) y **Pagar ahora**.
- Pie de métodos: `flex; gap:1.1rem; flex-wrap:wrap; margin-top:1.4rem; padding-top:1.1rem;
  border-top:1px solid var(--linea)`, mono `.75rem`, `letter-spacing:.14em`, mayúsculas,
  `--ink-muted`: `Webpay`, `Transferencia`, `Servipag`, `Mercado Pago`. Son **texto, no logos**.

### 9.3 Validación (se ejecuta al pulsar "Ir a pagar", no al escribir)
| Campo | Regla | Mensaje |
|---|---|---|
| nombre | no vacío (trim) | Necesitamos tu nombre para saber de quién es el regalo. |
| correo | no vacío | Sin correo no podemos enviarte el comprobante. |
| correo | `/^\S+@\S+\.\S+$/` | Revisa el formato del correo. |
| mensaje | no vacío (trim) | Escribe algo, aunque sea corto. |

Campo inválido: `border-color:var(--error)` + `<p>` de error debajo, `.83rem`,
`color:var(--error)`, `margin-top:.3rem`, asociado con `aria-describedby` + `aria-invalid`.

### 9.4 Paso 3 — "Conectando con la pasarela"
- Caja estrecha (`25rem`), centrada vertical, `text-align:center`.
- Spinner: `2.2rem × 2.2rem; border:2px solid var(--linea); border-top-color:var(--acento);
  border-radius:50%; animation:giro .9s linear infinite; margin:0 auto 1.2rem`, `aria-hidden`.
  `@keyframes giro { to { transform:rotate(360deg) } }`
- H2 Garamond 1.6rem: **Conectando con la pasarela**. Debajo el total en 1.2rem `tabular-nums`.
- Nota de maqueta: `border-left:2px solid var(--acento); background:var(--panel);
  padding:.7rem .9rem; font-size:.86rem; text-align:left; margin-top:1.3rem; color:var(--ink-muted)`
  — **"Maqueta."** en negrita `--tinta` + *" Acá va el redirect real a Flow, Webpay o
  Mercado Pago. No se cobra nada."*
  → **En producción este paso se elimina**: "Pagar ahora" redirige de verdad a la pasarela.
- Duración de la simulación: **2000 ms**.

### 9.5 Resumen de líneas (componente compartido)
`border-top` y `border-bottom` de 1px, `padding:.9rem 0`, `font-size:.93rem`.
- Una fila por ítem: `flex; justify-content:space-between; gap:1rem; padding:.22rem 0`.
  Etiqueta `«{nombre} × {n}»`, monto `precio × n` con `tabular-nums`.
- El aporte libre, si existe, es la última fila: etiqueta `Aporte libre`.
- Fila total: `font-family:'EB Garamond'; font-size:1.3rem; padding-top:.6rem;
  margin-top:.5rem; border-top:1px solid var(--linea)`, etiqueta `Total`.

### 9.6 Paso 4 — "¡Gracias!" (`listo`)
- Caja `33rem`, `text-align:center`.
- Caveat `clamp(2.6rem,10vw,3.6rem)`, `--acento-osc`: **¡Gracias!**
- Subrayado ondulado (`max-width:60%`).
- H2 Garamond `clamp(1.5rem,5vw,1.9rem)`: `Gracias, {nombre}.` (nombre del formulario, con trim).
- Resumen de líneas **congelado al momento del pago** (`text-align:left; margin:1.4rem 0 1.3rem`)
  — no debe vaciarse cuando se limpia el carrito.
- Párrafo `.93rem` en `--ink-muted`: *"Te llega el comprobante al correo. Antonia y Cristóbal
  reciben tu mensaje apenas se confirme el pago."*
- Botón primario a ancho completo (`flex:1; min-height:50px`): **Volver a la lista**.

### 9.7 Efecto del pago sobre la lista
Al completarse la pasarela, las partes del carrito se suman al progreso real de cada regalo:
`progreso[id] = min(objetivo, actual + partes_en_carrito)`. Al volver a la lista se ven las
barras avanzadas y los regalos que quedaron completos. (En producción esto viene del
backend; acá es estado local.)

---

## 10. Estado y lógica

```ts
type Estado = {
  carro: Record<number, number>;   // id → partes elegidas
  prog:  Record<number, number>;   // id → partes cubiertas (override de la semilla)
  libre: number;                   // aporte libre confirmado (CLP)
  libreTxt: string;                // texto formateado del input
  orden: 'original'|'precio-asc'|'precio-desc'|'faltan'|'nombre-asc';
  paso: null|'mensaje'|'confirmar'|'pasarela'|'listo';
  nombre: string; correo: string; mensaje: string;
  err: Record<string,string>;
  gracias: string;                 // nombre con trim, para "Gracias, X."
  cierre: {lineas, total} | null;  // snapshot para el paso 4
};
```

Derivados (no guardarlos en estado):
- `regalados(r) = prog[r.id] ?? r.regalados`
- `cubierto(r) = regalados(r) + (carro[r.id] ?? 0)`
- `lleno(r) = cubierto(r) >= r.objetivo`
- `lineas` y `total` a partir de `carro` + `libre`.

Reglas de orden:
- `precio-asc` / `precio-desc`: por `precio`.
- `nombre-asc`: `localeCompare(…, 'es')` — importante por tildes y la Ñ.
- `faltan`: descendente por `objetivo − regalados` (partes pendientes, **sin** contar el carrito).
- `original`: el orden del array, sin tocar.

Invariante: nunca permitir `cubierto > objetivo`. El `+` y el botón "Regalar" se bloquean
en el límite.

Formateo: `'$' + Number(n).toLocaleString('es-CL')`. Parseo de input: `Number(valor.replace(/\D/g,''))`.

Persistencia (opcional, no implementada): si guardas el carrito en `localStorage`, hazlo
bajo una clave propia y restáuralo al cargar.

---

## 11. Accesibilidad — cumplir sí o sí

- **Contraste:** todo texto ≥4.5:1. El microtexto usa `rgba(20,20,20,.62)` (≈5.9:1 sobre
  blanco) y el acento de texto `#905855` (5.65:1). No bajes esos alphas ni uses `#B06E6E`
  en texto.
- **Objetivos táctiles:** 48×48px mínimo en steppers y botones de barra; 50px en botones de
  formulario, montos sugeridos, select e inputs de aporte libre.
- `:focus-visible` visible en todo control, `outline:2px solid var(--acento-osc); outline-offset:2px`.
- `aria-live="polite"` en el total del carrito.
- `aria-label` descriptivo en los steppers (incluye el nombre del regalo).
- Labels reales en todos los inputs; la de "Otro monto" oculta visualmente (no `display:none`).
- SVGs decorativos con `aria-hidden="true"`.
- Escape cierra modales; el foco entra al abrir y vuelve al cerrar.
- Jerarquía de encabezados: un solo `<h1>` (hero), `<h2>` por sección y por modal, `<h3>`
  en nombres de regalo y en "Aporte libre".
- `html { -webkit-text-size-adjust:100% }` y `scroll-padding-top:70px`.

---

## 12. Responsive

No hay media queries de layout: todo es `clamp()`, `flex-wrap` y `auto-fit`. Verifica a
**360px, 390px, 768px, 1024px y 1440px**:
- 360–390px: nav del header baja a segunda línea; las filas de regalo apilan miniatura+texto
  arriba y precio+controles abajo; los 4 montos sugeridos van 2×2; la botonera de la barra
  de carrito se envuelve.
- ≥992px: el contenedor tope en 62rem y queda centrado con aire a los lados.
- La foto del hero y los modales nunca desbordan horizontalmente.
- Nada de `height` fija en contenedores con texto; nada de `white-space:nowrap` salvo el
  header (nombres y nav).

(La única media query del proyecto es `prefers-reduced-motion`, que apaga la animación del
spinner, la transición de la barra y el scroll suave.)

---

## 13. Errores a evitar (detectados en el prototipo)

1. **No** uses `#B06E6E` para texto; solo para líneas, ondas, barras de progreso, bordes y
   el "y" del H1 a tamaño display.
2. **No** cambies el layout del header por JS o por breakpoints: `flex-wrap:wrap` es la solución.
3. **No** pongas texto en alpha bajo (`.35`) — falla contraste.
4. **No** conviertas las filas de regalo en tarjetas: son filas con línea inferior.
5. **No** olvides el espaciador de 7rem cuando el carrito está activo.
6. **No** pongas `font-weight:bold` en EB Garamond: el diseño es todo 400.
7. **No** acumules el aporte libre: "Agregar aporte" reemplaza el valor anterior.
8. **No** vacíes el resumen del paso 4: usa el snapshot tomado al pagar.
9. **No** permitas cerrar el modal de pasarela.
10. **No** agregues emoji, iconos extra, gradientes ni sombras distintas de las cuatro definidas.

---

## 14. Assets pendientes (los provee la pareja)

| Slot | Uso | Tamaño objetivo |
|---|---|---|
| Foto principal | Hero, marco polaroid | 1920×1080 (16:10 recortada) |
| 9 fotos de regalo | Miniaturas cuadradas de la lista | ≥400×400, 1:1 |

Hasta entonces se usa el placeholder rayado de §8.3 con su etiqueta mono. El favicon y el
OG image también están pendientes.

---

## 15. Flags de configuración

Viven en `src/config.ts` y se aplican como tema/props del árbol, no como panel de UI para
el invitado.

| Flag | Tipo | Default | Efecto |
|---|---|---|---|
| `acento` | color | `#B06E6E` | Recalcula `--acento`, `--acento-osc` y las variantes con alpha |
| `estiloFoto` | `'polaroid' \| 'marco'` | `polaroid` | Rotación e "inclinación" del marco (§8.3) |
| `miniaturas` | boolean | `true` | Muestra u oculta las miniaturas de la lista |
| `notas` | boolean | `false` | Muestra la nota descriptiva bajo cada regalo |
