# Web de valoración de empresas

Web estática (Astro) que da a dueños de pymes una valoración orientativa **gratis y al
instante**, sin pedir el teléfono. Solo se pide el email si el usuario quiere el informe
detallado en PDF. Pensada para desplegarse en Netlify.

## Arrancar en local

```bash
npm install
npm run dev
```

Abre http://localhost:4321

Otros comandos:

```bash
npm run build     # build de producción en dist/
npm run preview   # sirve el build localmente
```

## Dónde tocar los números y textos (sin tocar código)

Todo lo editable vive en `src/config/`:

| Fichero | Qué controla |
|---|---|
| `sectores.json` | Múltiplos EV/EBITDA (min–max) y margen EBITDA por defecto de cada sector |
| `wacc.json` | Tabla de WACC por tramo de ventas + ajuste por sector (nivel 3, DCF) |
| `antiguedad.json` | Cómo la antigüedad desplaza el múltiplo hacia el alto del rango |
| `textos.json` | Marca, email, disclaimer, títulos SEO, copys del hero y el informe PDF |
| `faq.json` | Preguntas y respuestas de la FAQ |
| `ganchos.json` | Los 5 CTAs por perfil bajo el resultado |
| `sectores-paginas.json` | El copy completo de cada página /sectores/ (SEO programático) |

**Añadir un sector nuevo** = añadirlo a `sectores.json` (múltiplos) y a
`sectores-paginas.json` (copy de su página). La página, el sitemap y los enlaces
internos se generan solos en el siguiente build.

Tras editar un JSON, el servidor de desarrollo recarga solo. En producción hace falta
hacer commit + push (Netlify redespliega automáticamente).

La tasa de crecimiento perpetuo del DCF (g = 2 %) está en `src/lib/dcf.js` (constante
`G_TERMINAL`).

## Analítica (sin cookies, sin banner)

La web lleva integración con **Plausible** (o cualquier compatible, como Umami):
analítica sin cookies, coherente con nuestra promesa de privacidad y sin necesidad
de banner de consentimiento.

**Activarla (5 minutos):**
1. Crea una cuenta en https://plausible.io (o monta Umami gratis).
2. Añade tu dominio en su panel.
3. En `src/config/textos.json`, dentro de `"analitica"`: pon tu dominio en `"dominio"`
   y cambia `"activa"` a `true`.
4. Commit + push. Listo.

**Eventos que ya se registran solos** (además de las visitas):
- `Calculo` — cada vez que alguien calcula, con nivel y sector.
- `Lead` — cada captura de email, con el perfil (informe, vender, socios...).

La métrica clave a vigilar el primer mes: **% de visitantes que calculan** (objetivo
>25 %). Está explicado en `docs/plan-crecimiento.md`.

## Estructura

```
src/
  config/       ← parámetros y textos editables (ver tabla de arriba)
  lib/
    valoracion.js   ← lógica niveles 1 y 2 (múltiplos)
    dcf.js          ← lógica nivel 3 (DCF + selección automática de WACC)
    informe-pdf.js  ← genera el PDF (pdfmake, carga diferida)
  components/   ← calculadora, resultado, ganchos, form de lead, FAQ...
  layouts/Base.astro  ← SEO completo: meta, OG, Twitter, JSON-LD
  pages/        ← home, cómo valoramos, FAQ, privacidad, aviso legal
  pages/sectores/     ← carpeta vacía preparada para SEO programático por sector
```

## Los dos formularios de Netlify

La web usa **Netlify Forms** con dos formularios distintos:

1. **`calculos`** (silencioso): cada vez que un visitante calcula (solo el primer cálculo
   de cada sesión), se envía en segundo plano el sector, nivel, importes y rango
   resultante. **Sin datos personales** — es dato de negocio anónimo.
2. **`leads`**: el formulario real de captura. Email + perfil (qué gancho pulsó) +
   consentimiento RGPD. También recoge el teléfono opcional post-conversión.

Ambos tienen su versión estática oculta en el HTML (requisito de Netlify para detectarlos
en build cuando el envío se hace por JavaScript).

### ⚠ Activar las notificaciones por email (hay que hacerlo a mano en el panel)

Netlify no permite configurar las notificaciones desde código. Tras el primer deploy:

1. Entra en tu sitio en https://app.netlify.com
2. Ve a **Forms** (menú lateral). Deberías ver los formularios `calculos` y `leads`
   detectados tras el primer deploy.
3. Ve a **Site configuration → Notifications → Form submission notifications**
   (o desde Forms → Form notifications según la versión del panel).
4. Pulsa **Add notification → Email notification**.
5. Configura una notificación para el formulario `leads` → tu email. **Esta es la
   importante: cada lead te llegará al correo.**
6. (Opcional) Añade otra para `calculos` si quieres recibir cada cálculo anónimo por
   email. Si hay mucho volumen puede ser ruidoso: alternativa, revisar las submissions
   directamente en el panel de Forms.

**Cuota gratuita de Netlify Forms: 100 envíos/mes.** El form `calculos` solo envía el
primer cálculo de cada sesión para no quemar cuota. Si el tráfico crece, valorar el plan
de pago o mover la captura a otro backend.

## Desplegar en Netlify

1. Crea un repo en GitHub y sube el proyecto.
2. En Netlify: **Add new site → Import an existing project → GitHub** → elige el repo.
3. Netlify detecta Astro automáticamente (build: `npm run build`, publish: `dist`).
   El fichero `netlify.toml` ya lo deja configurado igualmente.
4. Deploy. A partir de ahí, cada push a la rama principal redespliega la web.
5. Activa las notificaciones de formularios (sección anterior).
6. Cuando tengas dominio: configúralo en Netlify y actualiza `SITE_URL` en
   `astro.config.mjs` y el `Sitemap:` de `public/robots.txt`.

## Pendientes antes de publicar

- [ ] Rellenar los placeholders legales en `src/pages/privacidad.astro` y
      `src/pages/aviso-legal.astro`: `[NOMBRE_RESPONSABLE]`, `[NIF]`,
      `[DOMICILIO_SOCIAL]`, `[EMAIL_CONTACTO]`, `[DOMINIO]`.
- [ ] Poner la marca y el email reales en `src/config/textos.json`.
- [ ] Actualizar `SITE_URL` en `astro.config.mjs` con el dominio definitivo.
- [ ] Actualizar la URL del sitemap en `public/robots.txt`.
- [ ] Crear una imagen OG real en `public/og-image.png` (1200×630 px).
- [ ] Activar las notificaciones de formularios en el panel de Netlify.

Ver `TODOS.md` para el roadmap de mejoras (integración con datos de Damodaran, páginas
por sector, etc.).
