# Mejoras futuras y roadmap técnico

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

## Otras mejoras técnicas pendientes

- [ ] Páginas por sector en `/sectores/` (programmatic SEO) una vez validado el MVP.
- [ ] Dashboard de proyecciones visual (gráfico de barras del FCF a 5 años) en el Nivel 3.
- [ ] Modo comparativa: ver cómo está tu empresa vs. la media del sector.
- [ ] Integración con CRM (HubSpot, Brevo) para el flujo de leads.
- [ ] A/B test de ganchos: qué perfil convierte más a lead.
- [ ] Versión premium con valoración ajustada por deuda neta (el usuario introduce deuda y caja).
