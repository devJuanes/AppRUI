export type TipoDocumento = {
  codigo: string
  abreviatura: string
  nombre: string
}

export const tiposDocumento: TipoDocumento[] = [
  { codigo: '3', abreviatura: 'CC', nombre: 'Cédula de ciudadanía' },
  { codigo: '2', abreviatura: 'TI', nombre: 'Tarjeta de identidad' },
  { codigo: '1', abreviatura: 'RC', nombre: 'Registro civil' },
  { codigo: '4', abreviatura: 'CE', nombre: 'Cédula de extranjería' },
  { codigo: '8', abreviatura: 'PEP', nombre: 'Permiso especial permanencia' },
  { codigo: '9', abreviatura: 'PPT', nombre: 'Permiso Protección Temporal' },
  { codigo: '6', abreviatura: 'PA', nombre: 'Pasaporte' },
  { codigo: '5', abreviatura: 'DNI', nombre: 'DNI (País de origen)' },
  { codigo: '7', abreviatura: 'SC', nombre: 'Salvoconducto refugiado' },
]

export type ConsultaResultado = {
  nombre: string
  sexo: string
  edad: string
  grupRui: string
  nivelRui: string
  grupoIngresos: string
  municipio: string
  departamento: string
  codMpio: string
  numeroDocumento: string
  tipoDocumento: TipoDocumento
  celular: string
  raw?: Record<string, unknown>
}

export function parseResultado(
  json: Record<string, unknown>,
  numeroDocumento: string,
  tipoDocumento: TipoDocumento,
): ConsultaResultado {
  return {
    nombre: String(json.nombre ?? '').trim(),
    sexo: String(json.sexo ?? '').trim(),
    edad: json.edad != null ? String(json.edad) : '',
    grupRui: String(json.grupRui ?? '').trim(),
    nivelRui: String(json.nivelRui ?? '').trim(),
    grupoIngresos: String(json.grupoIngresos ?? '').trim(),
    municipio: String(json.municipio ?? '').trim(),
    departamento: String(json.departamento ?? '').trim(),
    codMpio: String(json.codMpio ?? '').trim(),
    numeroDocumento,
    tipoDocumento,
    celular: '',
    raw: json,
  }
}

export const RESULTADO_STORAGE_KEY = 'apprui:resultado'
