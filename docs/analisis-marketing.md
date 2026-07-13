# Análisis de marketing — Web de valoración de empresas

*Julio 2026. Documento vivo: actualizar cuando haya datos reales de tráfico y conversión.*

---

## 1. Customer personas

### Persona principal: "Josep, 61 años" (≈60 % del target)
- Dueño de pyme consolidada (industria, servicios, comercio). 15–40 años de historia.
- Facturación 0,5–10 M€. Sin relevo generacional: los hijos no quieren el negocio.
- **Poco digital**: usa WhatsApp y el email. Se pierde en webs complejas. Desconfía de dar el teléfono porque sabe que le lloverán llamadas comerciales.
- Motivación: jubilarse con dignidad, saber "cuánto hay" antes de decidir nada.
- Miedo: que se sepa que quiere vender (empleados, clientes, competencia).
- **Qué necesita de nosotros**: el número YA, sin registrarse, sin que nadie le llame. Letra grande, cero jerga, un solo camino claro.

### Persona secundaria: "Marta, 45 años" (≈25 %)
- Empresaria en activo, quiere hacer crecer el valor de su empresa (o comprar a un socio).
- Digital media/alta. Compara herramientas. Aprecia metodología y transparencia.
- **Qué necesita**: el nivel 3 (simulador de proyecciones), la página "Cómo valoramos", datos con fuentes (Damodaran cuando esté).

### Persona terciaria: "El heredero / el asesor" (≈15 %)
- Necesita una referencia para un trámite: herencia, divorcio, entrada de inversor, banco.
- Busca algo imprimible y defendible → el informe PDF es su gancho natural.

---

## 2. Análisis de competencia

### Deale (deale.es) — el competidor de referencia
- Plataforma líder de compraventa de pymes en España. +3.000 empresas listadas, +40.000 empresarios registrados, red de compradores (fondos, family offices, search funds). Tienen financiación integrada (Deale Credit).
- **Su herramienta de valoración**: pide nombre, email, NIF de la empresa y teléfono ANTES de dar nada, y envía la valoración POR EMAIL. Es un formulario de captación puro.
- Fortalezas: marca, volumen, red de inversores reales, contenido de blog potente (SEO fuerte).
- Debilidades frente a nosotros: **fricción máxima en la valoración** (NIF + teléfono = barrera enorme para Josep), el resultado no es instantáneo, y el usuario sabe que le van a llamar.

### Otros
- **Calculadoras de asesorías/brokers** (múltiples): suelen pedir contacto antes del resultado o dar una cifra única sin metodología. Poca transparencia.
- **Herramientas internacionales** (BizBuySell, etc.): no localizadas para España, en inglés, múltiplos americanos.

### Qué hace bien la competencia y vamos a copiar MEJOR
- **Informe como enlace único compartible** (tipo `/report/22xse`): algunos competidores
  entregan el resultado como página online con URL propia en vez de (o además de) un
  PDF. Es más compartible (WhatsApp al socio, al asesor, al banco) y permite medir
  aperturas. **Nuestra versión mejorada**: enlace compartible SIN guardar los datos en
  ningún servidor (datos codificados en la propia URL) → mantenemos la promesa de
  privacidad que ellos no pueden cumplir, porque ellos capturan tus datos primero.
  Fase 2: ID corto con almacenamiento si vemos que se comparte. Detalle en TODOS.md.

### Nuestro posicionamiento (el hueco)
> **"El número primero."** Somos la única herramienta que da el rango en pantalla,
> al instante, gratis y sin pedir NADA. La confianza es el producto.
> No competimos con Deale en marketplace: competimos en el primer paso del viaje
> (la curiosidad), y lo ganamos porque no cobramos peaje de datos.

---

## 3. DAFO

| | |
|---|---|
| **Fortalezas** | Cero fricción (número sin registro) · metodología transparente y a la vista · web ultrarrápida (estática) · disclaimer honesto que genera confianza · coste de operación ~0 € |
| **Debilidades** | Marca nueva sin autoridad · sin red de compradores (no cerramos el círculo) · valoración menos precisa que una profesional · dependemos de SEO (lento) · cuota Netlify Forms 100/mes |
| **Oportunidades** | SEO programático por sector (nadie lo hace bien en español) · datos Damodaran como sello de rigor · Deale nos valida el mercado y educa al cliente · ola demográfica: miles de pymes sin relevo generacional en España la próxima década · partnership futuro con asesores M&A (monetización del lead) |
| **Amenazas** | Deale puede copiar el "número primero" en una tarde · Google puede meter IA en los resultados y comerse el SEO informacional · leads de baja calidad (curiosos) · cambios en múltiplos de mercado que dejen los JSON desfasados |

---

## 4. La pregunta clave: ¿web con "mil ofertas" o web sobria?

**Decisión: SOBRIA. Rotundamente.**

Razonamiento:
- Josep (persona principal) desconfía por defecto. Cada popup, banner o CTA agresivo
  confirma su sospecha de que "esto es para sacarme algo".
- Las webs con mil ofertas funcionan en e-commerce de impulso. Vender una empresa es la
  decisión económica más importante de la vida de Josep: la estética debe parecerse más
  a un despacho serio que a un chollo de Black Friday.
- Deale ya juega la carta de "plataforma con miles de oportunidades". Nuestra
  diferenciación es la contraria: UNA cosa, hecha con rigor, sin ruido.
- Regla práctica: **una sola CTA primaria por pantalla**. Todo lo demás, secundario y
  discreto. El número de la valoración es el protagonista absoluto; nada compite con él.

---

## 5. Decisiones de diseño derivadas (aplicadas)

1. **Tipografía base 18 px** (audiencia 55–65 años; la legibilidad es conversión).
2. **Franja de diferenciación bajo el hero**: "El número en pantalla · Gratis · Sin
   registro ni teléfono" — ataca directamente el punto débil de Deale sin nombrarla.
3. **Microcopy de confianza pegado a la calculadora**: "Tus datos no salen de tu
   navegador. No pedimos teléfono ni email para darte el resultado." La objeción #1
   se mata en el punto exacto donde surge.
4. **Una CTA primaria por pantalla**: Hero→calcular; Resultado→informe PDF. Los ganchos
   por perfil son secundarios (visual gris, no compiten).
5. **Paleta sobria mantenida** (azul marino/azul): transmite banca/despacho, no startup.
6. **Sin popups, sin newsletters intrusivas, sin cookies de terceros**: coherencia total
   con el mensaje de confidencialidad (y de paso, sin banner de cookies que estorbe).

---

## 6. Métricas para validar (cuando haya tráfico)

- % visitantes que calculan (objetivo inicial: >25 %).
- % calculadores que piden informe (objetivo: 8–15 %).
- % leads que dejan teléfono en el cierre suave (objetivo: 10–20 % de los leads).
- Distribución de perfiles en los ganchos → nos dice qué producto construir después.
