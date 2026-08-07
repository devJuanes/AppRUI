import { consultasEndpoint, ruiEndpoint } from '../config/api'
import {
  parseResultado,
  type ConsultaResultado,
  type TipoDocumento,
} from '../data/tiposDocumento'

export class CancelToken {
  private cancelled = false

  get isCancelled() {
    return this.cancelled
  }

  cancel() {
    this.cancelled = true
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function consultarUnaVez(
  numeroDocumento: string,
  tipoDocumento: TipoDocumento,
): Promise<ConsultaResultado> {
  const response = await fetch(ruiEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pNumDoc: numeroDocumento,
      pTipDoc: tipoDocumento.codigo,
    }),
    signal: AbortSignal.timeout(40000),
  })

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${await response.text()}`)
  }

  const decoded = (await response.json()) as Record<string, unknown>
  if (decoded.ok !== true) {
    throw new Error(
      String(
        decoded.mensaje ??
          decoded.message ??
          decoded.error ??
          'Respuesta sin ok:true',
      ),
    )
  }

  return parseResultado(decoded, numeroDocumento, tipoDocumento)
}

export async function consultarHastaExito(options: {
  numeroDocumento: string
  tipoDocumento: TipoDocumento
  cancel: CancelToken
  retryDelayMs?: number
}): Promise<ConsultaResultado | null> {
  const { numeroDocumento, tipoDocumento, cancel, retryDelayMs = 2000 } =
    options
  let intento = 0

  while (!cancel.isCancelled) {
    intento += 1
    console.log(
      `[RUI] Intento #${intento} → doc=${numeroDocumento} tipo=${tipoDocumento.abreviatura}`,
    )

    try {
      const resultado = await consultarUnaVez(numeroDocumento, tipoDocumento)
      console.log(`[RUI] ✓ Éxito en intento #${intento} → ${resultado.nombre}`)
      return resultado
    } catch (e) {
      console.log(`[RUI] ✗ Intento #${intento} falló:`, e)
    }

    if (cancel.isCancelled) break
    await sleep(retryDelayMs)
  }

  console.log(`[RUI] Bucle cancelado tras ${intento} intentos`)
  return null
}

export async function guardarConsulta(
  resultado: ConsultaResultado,
): Promise<boolean> {
  const payload = {
    numeroDocumento: resultado.numeroDocumento,
    celular: resultado.celular,
    tipoDocumento: {
      codigo: resultado.tipoDocumento.codigo,
      abreviatura: resultado.tipoDocumento.abreviatura,
      nombre: resultado.tipoDocumento.nombre,
    },
    nombre: resultado.nombre,
    sexo: resultado.sexo,
    edad: resultado.edad,
    grupRui: resultado.grupRui,
    nivelRui: resultado.nivelRui,
    grupoIngresos: resultado.grupoIngresos,
    municipio: resultado.municipio,
    departamento: resultado.departamento,
    codMpio: resultado.codMpio,
  }

  try {
    const response = await fetch(consultasEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(20000),
    })
    const decoded = (await response.json()) as Record<string, unknown>
    const ok =
      response.ok && decoded != null && typeof decoded === 'object' && decoded.ok === true
    console.log(ok ? '[DB] Guardado+SMS OK' : '[DB] Error al guardar', decoded)
    return ok
  } catch (e) {
    console.log('[DB] Excepción al guardar:', e)
    return false
  }
}
