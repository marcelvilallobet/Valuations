/**
 * Curva de probabilidad de precio (orientativa) para el bloque de resultado.
 *
 * Idea (inspirada en valuations.com, adaptada y hecha honesta): el rango de
 * valoración que ya calculamos [valorMin, valorMax] con su estimación central
 * se representa como una campana de probabilidad. No inventa números nuevos:
 * la campana se ajusta para que el mínimo y el máximo caigan en los percentiles
 * ~5 y ~95, y las franjas por tipo de comprador reparten ese mismo rango.
 *
 * Sin dependencias: se puede testear de forma pura.
 */

/** Aproximación de la función error (Abramowitz & Stegun 7.1.26). */
function erf(x) {
  const signo = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const t = 1 / (1 + 0.3275911 * ax);
  const y =
    1 -
    ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t +
      0.254829592) *
      t *
      Math.exp(-ax * ax);
  return signo * y;
}

/** CDF de una normal: P(X ≤ x). */
export function cdfNormal(x, mu, sigma) {
  if (sigma <= 0) return x >= mu ? 1 : 0;
  return 0.5 * (1 + erf((x - mu) / (sigma * Math.SQRT2)));
}

/**
 * Construye el modelo de la curva a partir del resultado de valoración.
 *
 * @param {{valorMin:number, valorCentral:number, valorMax:number}} r
 * @param {number} [nPuntos=72] — resolución de la campana
 * @returns {{
 *   mu:number, sigma:number, xIni:number, xFin:number,
 *   puntos:{x:number,y:number}[],   // y ∈ [0,1] (densidad normalizada a pico 1)
 *   pFloor:number,                  // P(vender ≥ valorMin)
 *   pRango:number,                  // P(vender dentro de [min,max])
 *   valorMin:number, valorCentral:number, valorMax:number,
 *   compradores:{id:string,etiqueta:string,min:number,max:number}[]
 * }}
 */
export function modeloCurva(r, nPuntos = 72) {
  const { valorMin, valorCentral, valorMax } = r;

  // La campana se centra en el punto medio del rango probable [mín, máx], así
  // es simétrica y legible sea cual sea el nivel (en el nivel Rápido la
  // "estimación central" puede coincidir con el mínimo). El marcador de nuestra
  // estimación se dibuja aparte, en valorCentral.
  const medio = (valorMin + valorMax) / 2;
  // sigma tal que mín y máx caigan ~ percentiles 5/95 (±1.645σ).
  const semiAncho = (valorMax - valorMin) / 2;
  const sigma = semiAncho > 0 ? semiAncho / 1.645 : Math.max(medio * 0.15, 1);

  const xIni = Math.max(0, medio - 3.2 * sigma);
  const xFin = medio + 3.2 * sigma;

  const puntos = [];
  for (let i = 0; i <= nPuntos; i++) {
    const x = xIni + (xFin - xIni) * (i / nPuntos);
    const y = Math.exp(-0.5 * Math.pow((x - medio) / sigma, 2));
    puntos.push({ x, y });
  }

  const pFloor = 1 - cdfNormal(valorMin, medio, sigma);
  const pRango = cdfNormal(valorMax, medio, sigma) - cdfNormal(valorMin, medio, sigma);

  return {
    mu: medio,
    sigma,
    xIni,
    xFin,
    puntos,
    pFloor,
    pRango,
    valorMin,
    valorCentral,
    valorMax,
    // Reparte el MISMO rango honesto por comportamiento de comprador, con
    // franjas que SE SOLAPAN (pagan parecido): el financiero (rentabilidad)
    // tiende a la parte baja-media; el estratégico (sinergias) a la media-alta.
    // No añade primas inventadas ni los separa artificialmente.
    compradores: [
      { id: "financiero", etiqueta: "Comprador financiero", min: valorMin, max: valorMin + 0.65 * (valorMax - valorMin) },
      { id: "estrategico", etiqueta: "Comprador estratégico", min: valorMin + 0.35 * (valorMax - valorMin), max: valorMax },
    ],
  };
}
