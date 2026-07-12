/**
 * Lógica de valoración por múltiplos EV/EBITDA (Niveles 1 y 2).
 * Lee parámetros de los JSON de config pasados como argumento
 * para que el módulo sea puramente funcional y fácil de testear.
 */

/**
 * Devuelve el factor de antigüedad (0–1) para los años dados.
 * @param {number} anios
 * @param {Array}  tramos  — de antiguedad.json
 */
function factorAntiguedad(anios, tramos) {
  const tramo = tramos.find(t => anios >= t.anios_min && anios < t.anios_max);
  return tramo ? tramo.factor : 0;
}

/**
 * Múltiplo "central" ajustado por antigüedad dentro del rango del sector.
 * Más años → más cerca del extremo alto del rango.
 */
function multiploAjustado(sector, factor) {
  const rango = sector.multiplo_max - sector.multiplo_min;
  return sector.multiplo_min + rango * factor;
}

/**
 * NIVEL 1 — Solo facturación.
 * Estima EBITDA con el margen por defecto del sector.
 * Devuelve rango min/max usando el factor de antigüedad sobre el multiplo.
 *
 * @param {number} ventas
 * @param {string} sectorId
 * @param {object} configSectores  — contenido de sectores.json
 * @param {object} configAntiguedad — contenido de antiguedad.json
 * @param {number} [anios=0]       — años de antigüedad (opcional en nivel 1)
 * @returns {{ valorMin, valorMax, ebitdaEstimado, sectorNombre, multiplo_min, multiplo_max, multiplo_central, metodologia }}
 */
export function calcularNivel1(ventas, sectorId, configSectores, configAntiguedad, anios = 0) {
  const sector = configSectores.sectores.find(s => s.id === sectorId);
  if (!sector) throw new Error(`Sector desconocido: ${sectorId}`);

  const ebitda = ventas * sector.margen_ebitda_default;
  const factor = factorAntiguedad(anios, configAntiguedad.tramos);
  const central = multiploAjustado(sector, factor);

  // El rango mostrado al usuario es ± en torno al central ponderado,
  // con el mínimo sectorial siempre como suelo.
  const valorMin = ebitda * sector.multiplo_min;
  const valorMax = ebitda * (sector.multiplo_min + (sector.multiplo_max - sector.multiplo_min) * Math.max(factor, 0.85));
  const valorCentral = ebitda * central;

  return {
    valorMin: Math.round(valorMin),
    valorMax: Math.round(valorMax),
    valorCentral: Math.round(valorCentral),
    ebitdaEstimado: Math.round(ebitda),
    sectorNombre: sector.nombre,
    multiplo_min: sector.multiplo_min,
    multiplo_max: sector.multiplo_max,
    multiplo_central: parseFloat(central.toFixed(1)),
    margenEbitdaUsado: sector.margen_ebitda_default,
    metodologia: 'multiplos-nivel1',
  };
}

/**
 * NIVEL 2 — Facturación + EBITDA real + antigüedad.
 * Igual que nivel 1 pero usa el EBITDA que introduce el usuario.
 *
 * @param {number} ventas
 * @param {number} ebitda
 * @param {string} sectorId
 * @param {number} anios
 * @param {object} configSectores
 * @param {object} configAntiguedad
 * @returns {{ valorMin, valorMax, valorCentral, sectorNombre, multiplo_min, multiplo_max, multiplo_central, metodologia }}
 */
export function calcularNivel2(ventas, ebitda, sectorId, anios, configSectores, configAntiguedad) {
  const sector = configSectores.sectores.find(s => s.id === sectorId);
  if (!sector) throw new Error(`Sector desconocido: ${sectorId}`);

  const factor = factorAntiguedad(anios, configAntiguedad.tramos);
  const central = multiploAjustado(sector, factor);

  const valorMin = ebitda * sector.multiplo_min;
  const valorMax = ebitda * (sector.multiplo_min + (sector.multiplo_max - sector.multiplo_min) * Math.max(factor, 0.85));
  const valorCentral = ebitda * central;

  return {
    valorMin: Math.round(valorMin),
    valorMax: Math.round(valorMax),
    valorCentral: Math.round(valorCentral),
    ebitdaUsado: Math.round(ebitda),
    sectorNombre: sector.nombre,
    multiplo_min: sector.multiplo_min,
    multiplo_max: sector.multiplo_max,
    multiplo_central: parseFloat(central.toFixed(1)),
    factorAntiguedad: factor,
    metodologia: 'multiplos-nivel2',
  };
}
