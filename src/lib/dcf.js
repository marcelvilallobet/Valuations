/**
 * Lógica DCF (Descuento de Flujos de Caja) para el Nivel 3.
 * El WACC se selecciona automáticamente según ventas + sector.
 * Los parámetros llegan de wacc.json y sectores.json.
 */

const G_TERMINAL = 0.02; // tasa de crecimiento perpetuo a largo plazo (editable aquí)

/**
 * Selecciona el WACC medio para un nivel de ventas y sector.
 * Devuelve { waccMin, waccMax, waccUsado } donde waccUsado = punto medio ajustado.
 *
 * @param {number} ventas
 * @param {string} sectorId
 * @param {object} configWacc  — contenido de wacc.json
 */
export function seleccionarWacc(ventas, sectorId, configWacc) {
  const tramo = configWacc.tramos.find(
    t => ventas >= t.ventas_min && ventas < t.ventas_max
  ) || configWacc.tramos[configWacc.tramos.length - 1];

  const ajuste = configWacc.ajustes_sector[sectorId] ?? 0;
  const waccMin = parseFloat((tramo.wacc_min + ajuste).toFixed(4));
  const waccMax = parseFloat((tramo.wacc_max + ajuste).toFixed(4));
  const waccUsado = parseFloat(((waccMin + waccMax) / 2).toFixed(4));

  return { waccMin, waccMax, waccUsado };
}

/**
 * NIVEL 3 — DCF completo.
 * Proyecta FCF durante 5 años con las tasas de crecimiento que introduce el usuario,
 * calcula el valor terminal y descuenta todo al presente.
 * Devuelve el rango usando waccMin / waccMax.
 *
 * @param {number}   ventas
 * @param {number}   ebitdaActual
 * @param {string}   sectorId
 * @param {number[]} tasasCrecimiento  — array de 5 tasas anuales, p.ej. [0.05, 0.07, 0.10, 0.08, 0.06]
 * @param {object}   configWacc
 * @param {object}   configSectores
 * @returns {{ valorMin, valorMax, valorCentral, waccMin, waccMax, waccUsado, flujos, valorTerminalCentral, metodologia }}
 */
export function calcularDCF(ventas, ebitdaActual, sectorId, tasasCrecimiento, configWacc, configSectores) {
  const sector = configSectores.sectores.find(s => s.id === sectorId);
  if (!sector) throw new Error(`Sector desconocido: ${sectorId}`);

  const { waccMin, waccMax, waccUsado } = seleccionarWacc(ventas, sectorId, configWacc);

  // Proyección de FCF a 5 años (usamos EBITDA como proxy de FCF libre)
  const flujos = [];
  let ebitdaProyectado = ebitdaActual;
  for (let i = 0; i < 5; i++) {
    ebitdaProyectado = ebitdaProyectado * (1 + (tasasCrecimiento[i] ?? 0));
    flujos.push(Math.round(ebitdaProyectado));
  }

  // Función que descuenta flujos + valor terminal con un WACC dado
  function valorConWacc(wacc) {
    let vpFlujos = 0;
    for (let i = 0; i < 5; i++) {
      vpFlujos += flujos[i] / Math.pow(1 + wacc, i + 1);
    }
    const fcf5 = flujos[4];
    const valorTerminal = (fcf5 * (1 + G_TERMINAL)) / (wacc - G_TERMINAL);
    const vpTerminal = valorTerminal / Math.pow(1 + wacc, 5);
    return { total: vpFlujos + vpTerminal, valorTerminal };
  }

  const { total: valorCentral, valorTerminal: vtCentral } = valorConWacc(waccUsado);
  const { total: valorConMin } = valorConWacc(waccMax); // wacc alto → valor bajo
  const { total: valorConMax } = valorConWacc(waccMin); // wacc bajo → valor alto

  return {
    valorMin: Math.round(valorConMin),
    valorMax: Math.round(valorConMax),
    valorCentral: Math.round(valorCentral),
    waccMin,
    waccMax,
    waccUsado,
    flujos,
    valorTerminalCentral: Math.round(vtCentral),
    sectorNombre: sector.nombre,
    tasasCrecimiento,
    gTerminal: G_TERMINAL,
    metodologia: 'dcf-nivel3',
  };
}
