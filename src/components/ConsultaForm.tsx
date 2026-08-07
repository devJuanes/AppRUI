import { ArrowRight, ChevronDown } from 'lucide-react'
import { useState } from 'react'
import type { TipoDocumento } from '../data/tiposDocumento'
import { GlassCard } from './GlassCard'
import { TipoDocumentoPicker } from './TipoDocumentoPicker'

type Props = {
  documento: string
  tipo: TipoDocumento
  cargando: boolean
  onDocumentoChange: (value: string) => void
  onTipoChange: (tipo: TipoDocumento) => void
  onSubmit: () => void
}

export function ConsultaForm({
  documento,
  tipo,
  cargando,
  onDocumentoChange,
  onTipoChange,
  onSubmit,
}: Props) {
  const [pickerOpen, setPickerOpen] = useState(false)

  return (
    <>
      <GlassCard className="rounded-3xl px-5 pt-5 pb-[18px]">
        <h2 className="text-[17px] leading-tight font-bold tracking-[-0.2px] text-text">
          Datos de consulta
        </h2>
        <p className="mt-1 text-[13px] leading-snug text-muted">
          Selecciona el tipo e ingresa el número de documento
        </p>

        <div className="mt-[18px] flex flex-col gap-3 md:flex-row md:items-start md:gap-3">
          {/* Móvil: tipo arriba. PC: cédula izquierda */}
          <label className="order-2 min-w-0 md:order-1 md:flex-[3]">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              Número de documento
            </span>
            <input
              value={documento}
              onChange={(e) =>
                onDocumentoChange(e.target.value.replace(/\D/g, ''))
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') onSubmit()
              }}
              inputMode="numeric"
              placeholder="Digita tu cédula"
              className="w-full rounded-[14px] border-0 bg-fill px-3.5 py-3.5 text-base font-semibold tracking-[0.4px] text-text outline-none placeholder:font-medium placeholder:tracking-normal placeholder:text-muted/70 focus:ring-[1.4px] focus:ring-blue"
            />
          </label>

          <div className="order-1 min-w-0 md:order-2 md:flex-[2]">
            <span className="mb-1.5 block text-xs font-semibold text-muted">
              Tipo de documento
            </span>
            <button
              type="button"
              onClick={() => setPickerOpen(true)}
              className="btn-soft flex w-full items-center gap-2 rounded-[14px] bg-fill px-3.5 py-3.5 text-left"
            >
              <span className="min-w-0 flex-1 truncate text-sm font-semibold text-text">
                {tipo.abreviatura} · {tipo.nombre}
              </span>
              <ChevronDown className="h-5 w-5 shrink-0 text-muted" />
            </button>
          </div>
        </div>

        <button
          type="button"
          disabled={cargando || !documento.trim()}
          onClick={onSubmit}
          className="btn-primary mt-[18px] w-full py-2.5 text-[15px] disabled:cursor-not-allowed"
        >
          {cargando ? (
            <>
              <span className="h-[18px] w-[18px] animate-spin rounded-full border-[2.2px] border-white/30 border-t-white" />
              Consultando…
            </>
          ) : (
            <>
              <ArrowRight className="h-[18px] w-[18px]" strokeWidth={2.5} />
              Consultar RUI
            </>
          )}
        </button>
      </GlassCard>

      <TipoDocumentoPicker
        open={pickerOpen}
        value={tipo}
        onClose={() => setPickerOpen(false)}
        onSelect={onTipoChange}
      />
    </>
  )
}
