/**
 * Motor del INFORME interactivo (inspirado en valuations.com, adaptado a España).
 *
 * A partir de 3 palancas — facturación, margen EBITDA y crecimiento — calcula la
 * valoración por TRES métodos y los pondera para dar una cifra central:
 *   1. DCF (descuento de flujos a 5 años, WACC por sector/tamaño).
 *   2. Múltiplos EV/EBITDA (comparables privados del sector).
 *   3. Múltiplo sobre ventas (proxy de mercado con la economía típica del sector).
 *
 * El rango [mín, máx] sale de la discrepancia entre métodos, que es justo lo que
 * alimenta la curva de probabilidad. Sin dependencias externas: puro y testeable.
 */
import { seleccionarWacc } from "./dcf.js";

const G_TERMINAL = 0.02; // crecimiento perpetuo a largo plazo
const PESOS = { dcf: 0.5, ebitda: 0.35, ventas: 0.15 }; // suman 1

/**
 * @param {{ventas:number, margen:number, crecimiento:number, sectorId:string}} inputs
 *        margen y crecimiento en tanto por uno (0.18 = 18 %).
 * @param {object} configSectores — sectores.json
 * @param {object} configWacc — wacc.json
 */
export function calcularInforme({ ventas, margen, crecimiento, sectorId }, configSectores, configWacc) {
  const sector = configSectores.sectores.find((s) => s.id === sectorId);
  if (!sector) throw new Error(`Sector desconocido: ${sectorId}`);

  const ebitda = Math.max(0, ventas * margen);

  // Múltiplo EV/EBITDA ajustado por crecimiento dentro del rango del sector:
  // más crecimiento → más cerca del extremo alto.
  const gFactor = Math.min(1, Math.max(0, crecimiento / 0.2)); // 0 %..20 %+ → 0..1
  const multiplo = sector.multiplo_min + (sector.multiplo_max - sector.multiplo_min) * gFactor;

  // ── Método 1: DCF ──────────────────────────────────────────────────────────
  const { waccUsado } = seleccionarWacc(ventas, sectorId, configWacc);
  const flujos = [];
  let e = ebitda;
  for (let i = 0; i < 5; i++) {
    e = e * (1 + crecimiento);
    flujos.push(e);
  }
  let vpFlujos = 0;
  for (let i = 0; i < 5; i++) vpFlujos += flujos[i] / Math.pow(1 + waccUsado, i + 1);
  const valorTerminal = (flujos[4] * (1 + G_TERMINAL)) / (waccUsado - G_TERMINAL);
  const valDCF = vpFlujos + valorTerminal / Math.pow(1 + waccUsado, 5);

  // ── Método 2: Múltiplos EV/EBITDA ─────────────────────────────────────────
  const valEbitda = ebitda * multiplo;

  // ── Método 3: Múltiplo sobre ventas (economía típica del sector) ──────────
  const evSales = sector.margen_ebitda_default * ((sector.multiplo_min + sector.multiplo_max) / 2);
  const valVentas = ventas * evSales;

  const metodos = [
    { id: "dcf", nombre: "Descuento de flujos (DCF)", valor: Math.round(valDCF), peso: PESOS.dcf },
    { id: "ebitda", nombre: "Múltiplos EV/EBITDA", valor: Math.round(valEbitda), peso: PESOS.ebitda },
    { id: "ventas", nombre: "Múltiplo sobre ventas", valor: Math.round(valVentas), peso: PESOS.ventas },
  ];

  const valorCentral = Math.round(metodos.reduce((acc, m) => acc + m.valor * m.peso, 0));
  const valores = metodos.map((m) => m.valor);
  let valorMin = Math.min(...valores, valorCentral);
  let valorMax = Math.max(...valores, valorCentral);

  // Si los métodos coinciden demasiado, damos una horquilla mínima para la curva.
  if (valorMax - valorMin < valorCentral * 0.05) {
    valorMin = Math.round(valorCentral * 0.85);
    valorMax = Math.round(valorCentral * 1.15);
  }

  return {
    ventas,
    margen,
    crecimiento,
    sectorId,
    sectorNombre: sector.nombre,
    ebitda: Math.round(ebitda),
    multiplo: parseFloat(multiplo.toFixed(1)),
    waccUsado,
    flujos: flujos.map(Math.round),
    metodos,
    valorCentral,
    valorMin: Math.round(valorMin),
    valorMax: Math.round(valorMax),
    metodologia: "informe",
  };
}
