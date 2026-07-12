# Análisis de riesgos — estrategia y situación actual

*Julio 2026. Ordenados por gravedad × probabilidad. Cada riesgo con su mitigación.*

---

## 🔴 Riesgos altos (atacar ya)

### 1. Dependencia total del SEO como único canal
Todo el plan de crecimiento descansa en un canal que (a) tarda 6-12 meses, (b) no
controlamos y (c) está en plena disrupción por las AI Overviews de Google.
Si el SEO no llega, no hay plan B activo.
**Mitigación**: activar al menos un segundo canal desde el mes 1 — LinkedIn orgánico
(gratis, encaja con M&A) o partnerships con gestorías. No esperar a "ver si el SEO
funciona" para diversificar.

### 2. El diferenciador es copiable en una tarde
"El número primero" no tiene barrera técnica: si Deale (o cualquiera) ve que funciona,
lo replica. Nuestra única defensa real es la velocidad y la marca.
**Mitigación**: construir lo que sí cuesta copiar — la serie de datos propios (qué
sectores calculan, qué rangos salen), la autoridad SEO acumulada y la integración de
fuentes (Damodaran). Ser "la calculadora de referencia" antes de que un grande se fije.

### 3. Leads capturados que se enfrían: no hay autoresponder
Hoy el email se captura pero el usuario NO recibe nada en su bandeja (el PDF solo se
descarga en el momento). Un lead que no recibe respuesta en minutos se enfría, y la
notificación de Netlify solo la vemos nosotros.
**Mitigación**: conectar un autoresponder (Brevo, gratis hasta 300 emails/día) que
envíe el informe + secuencia de 2-3 emails. Es LA mejora de conversión más barata
disponible. Prioridad alta post-lanzamiento.

### 4. Incumplimiento RGPD por placeholders sin rellenar
La política de privacidad y el aviso legal tienen [NOMBRE_RESPONSABLE], [NIF], etc.
Publicar así = incumplir RGPD/LSSI desde el día 1, con multas posibles y, peor,
destruyendo la confianza que ES nuestro producto.
**Mitigación**: rellenar antes del deploy público. Es 10 minutos. Bloqueante de lanzamiento.

---

## 🟠 Riesgos medios (vigilar, plan preparado)

### 5. Cuota de Netlify Forms: 100 envíos/mes
Cada cálculo (1º de sesión) + cada lead + cada teléfono consume cuota. Con solo ~50
visitantes/día que calculen, la cuota vuela a mitad de mes y DEJAMOS DE RECIBIR LEADS
sin enterarnos.
**Mitigación**: (a) vigilar el consumo en el panel las primeras semanas; (b) si crece,
pasar el form `calculos` a analítica de eventos (Plausible ya lo registra gratis e
ilimitado) y reservar Netlify Forms solo para `leads`; (c) plan de pago si hace falta
(19 $/mes, 1.000 envíos).

### 6. Datos de mercado que caducan en silencio
Los múltiplos y WACC de los JSON son razonables hoy; en 18 meses pueden estar
desfasados y nadie nos avisará. Una calculadora con datos viejos da resultados malos
con total seguridad aparente.
**Mitigación**: cita de fuentes y fecha visible en la web ("parámetros revisados en
[fecha]"); calendario de revisión semestral; integración Damodaran (TODOS.md) para
semi-automatizarlo.

### 7. Google + IA se comen el clic informacional
Las AI Overviews responden "cuánto vale una empresa" sin que nadie visite ninguna web.
El contenido informacional puro pierde valor como canal.
**Mitigación**: nuestra apuesta ya es la correcta — una HERRAMIENTA no es resumible
por la IA. Reforzar: que todas las páginas de contenido empujen a la calculadora, no
al revés. El contenido es el anzuelo, la herramienta es el destino.

### 8. Calidad de lead baja (curiosos, no vendedores)
La gratuidad y el anonimato atraen a todo el mundo, incluido el 90 % que solo curiosea.
Si algún día monetizamos vendiendo leads a asesores M&A, el comprador pagará por
calidad, no volumen.
**Mitigación**: el campo `perfil` de los ganchos ya segmenta la intención (vender ≠
curiosear). Medir la distribución desde el día 1 y diseñar la monetización sobre los
perfiles calientes ("vender", "socios", "trámite").

---

## 🟡 Riesgos menores (asumidos conscientemente)

### 9. Marca y dominio sin asegurar
"ValoraPyme" está puesto pero el dominio no está comprado ni la marca registrada.
Si la web funciona, alguien puede ocupar el espacio.
**Mitigación**: comprar dominio (~10 €/año) al decidir el nombre definitivo. Registro
de marca (~150 €) solo si hay tracción — no antes.

### 10. Bus factor = 1
Todo el proyecto (código, panel Netlify, GitHub, decisiones de parámetros) depende de
una persona. Riesgo asumible en fase MVP.
**Mitigación**: este repo + los docs + el README ya documentan casi todo. Suficiente por ahora.

### 11. La promesa de privacidad limita la analítica
"Tus datos no salen de tu navegador" nos impide usar retargeting, píxeles de Meta/Google
y cualquier tracking agresivo. Renunciamos a herramientas de marketing potentes.
**Mitigación**: asumido a propósito — la confianza ES el posicionamiento. La analítica
sin cookies (Plausible) da lo necesario sin romper la promesa. No cruzar esa línea.

---

## Resumen ejecutivo

| # | Riesgo | Gravedad | Acción |
|---|---|---|---|
| 1 | Solo SEO como canal | 🔴 | 2º canal desde el mes 1 |
| 2 | Diferenciador copiable | 🔴 | Correr: datos propios + autoridad |
| 3 | Leads sin autoresponder | 🔴 | Brevo gratis, post-lanzamiento inmediato |
| 4 | Placeholders RGPD | 🔴 | Rellenar ANTES del deploy. Bloqueante |
| 5 | Cuota Netlify 100/mes | 🟠 | Vigilar; mover `calculos` a Plausible si crece |
| 6 | Datos que caducan | 🟠 | Fecha visible + revisión semestral + Damodaran |
| 7 | AI Overviews | 🟠 | Herramienta > contenido (ya en marcha) |
| 8 | Leads de baja calidad | 🟠 | Segmentar por perfil desde el día 1 |
| 9 | Dominio sin comprar | 🟡 | ~10 € al decidir nombre |
| 10 | Bus factor 1 | 🟡 | Docs al día (hecho) |
| 11 | Privacidad limita mkt | 🟡 | Asumido: es el posicionamiento |
