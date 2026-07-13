# Mejoras futuras y roadmap técnico

## Marketing / captación (apuntado 14-jul-2026, pedido por Marcel)

- [ ] **Ideas de vídeo TikTok para traer tráfico**: buscar formatos que funcionen en el
      nicho (p.ej. "¿cuánto vale un bar que factura 300k?", reacción a valoraciones,
      "3 errores al vender tu empresa"). El gancho natural es decir una cifra en voz alta.
- [ ] **Definir quién es el cliente**: ¿el empresario que vende (jubilación, cansancio)?
      ¿el que compra? ¿asesores/gestorías que revenden el servicio? Decidirlo condiciona
      el contenido y el cierre. Pista: los perfiles de los ganchos ya nos dan la señal.
- [ ] **Cómo cerrar al cliente**: definir el paso posterior al lead (llamada del analista
      ya existe como cierre suave) → guion de llamada, oferta concreta y precio.
- [x] **Aviso por email cuando alguien entra o calcula**: hecho vía Netlify Forms
      (forms "visitas" y "calculos"). Falta activar las notificaciones en el panel de
      Netlify → Forms → Form notifications (ver instrucciones en README/commit).

## Fuentes de datos externas (PRIORIDAD ALTA)

### Conexión con datos de Damodaran
- Aswath Damodaran (NYU Stern) publica cada año tablas actualizadas de:
  - **WACC por sector** → https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/wacc.html
  - **Múltiplos EV/EBITDA por sector** → https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/vebitda.html
  - **Betas por sector** → https://pages.stern.nyu.edu/~adamodar/New_Home_Page/datafile/betas.html
- Idea: script anual (Node o Python) que descarga los CSV de Damodaran, mapea los sectores
  a los nuestros (tecnología, hostelería, etc.) y actualiza wacc.json y sectores.json automáticamente.
- Ventaja: podemos mostrar en la web "parámetros actualizados con datos de enero 2025 (Damodaran NYU)"
  → enorme credibilidad y diferenciación SEO.

### Otras fuentes de múltiplos
- **BVD Orbis / SABI**: base de datos de transacciones M&A europeas. De pago, pero permite
  comparables reales en España.
- **Mergermarket / PitchBook**: transacciones M&A por sector. Caras, pero para futuras partnerships
  o servicios premium.
- **Informes anuales de brokers M&A españoles** (DC Advisory, Alantra, GBS Finance): suelen
  publicar resúmenes de múltiplos por sector. Útiles para validar los rangos de sectores.json.
- **INE / Banco de España**: datos macro para ajustar la prima de riesgo país en el WACC.

### Mostrar las fuentes en la web
- Añadir en `textos.json` un campo `fuentes_wacc` y `fuentes_multiplos` con las URLs y fechas.
- Mostrar en la página "Cómo valoramos" una sección "Fuentes y metodología" con las referencias.
- Genera confianza y E-E-A-T para Google.

---

## Versiones / modos alternativos de valoración (segundas opiniones)

Idea: montar variantes de la calculadora con los criterios de distintas personas y
compararlas contra la versión actual (parámetros, múltiplos, ajustes). Sirve para
validar nuestros números, para A/B testing y para tener "segundas opiniones" internas.

- [ ] **Versión "modo Narcís"**: recoger los criterios/parámetros que diga Narcís y
      montarla como variante (probablemente no sea buena — la premisa es precisamente
      contrastarla con datos antes de descartar o incorporar nada).
- [ ] **Versión "modo [otra persona]"**: ídem con otra opinión de referencia, para
      tener al menos dos contrastes independientes.
- [ ] Definir cómo comparar: misma empresa de prueba en los 3 modos → ver divergencia
      de rangos. Si algún modo diverge mucho, entender por qué (puede haber una
      lección para nuestros JSON).

Nota técnica: con la arquitectura actual es barato — cada "modo" es solo otro juego
de JSON (sectores/wacc/antiguedad alternativos). No hace falta tocar código.

## Informe como enlace compartible (copiado de la competencia, mejorado)

Visto en competidores: el informe como página online con URL única (`/report/22xse`).
Lo copiamos mejor (ver docs/analisis-marketing.md, sección competencia):

- [ ] **Fase 1 — sin backend**: página `/informe` que lee los datos codificados de la
      propia URL (`/informe#s=salud&e=300000...`) y pinta el informe online.
      Compartible por WhatsApp, cero servidores, coherente con nuestra privacidad.
      El PDF se mantiene como descarga complementaria.
- [ ] **Fase 2 — solo si la gente comparte**: ID corto de verdad (`/report/22xse`) con
      Netlify Functions + Netlify Blobs (o Supabase). Permite medir aperturas.
      ⚠ Implica guardar datos financieros en servidor: revisar el texto de la promesa
      de privacidad antes de activarlo.
- [ ] Botón "Compartir informe" junto al de descargar PDF (Web Share API en móvil,
      copiar enlace en desktop).

## Otras mejoras técnicas pendientes

- [x] Páginas por sector en `/sectores/` (programmatic SEO). **HECHO** (9 páginas + hub).
- [ ] Dashboard de proyecciones visual (gráfico de barras del FCF a 5 años) en el Nivel 3.
- [ ] Modo comparativa: ver cómo está tu empresa vs. la media del sector.
- [ ] Integración con CRM (HubSpot, Brevo) para el flujo de leads.
- [ ] A/B test de ganchos: qué perfil convierte más a lead.
- [ ] Versión premium con valoración ajustada por deuda neta (el usuario introduce deuda y caja).
