import {
  BadgeCheck,
  Baby,
  Fingerprint,
  GraduationCap,
  IdCard,
  Plane,
  FileText,
  Globe,
  Shield,
  type LucideIcon,
} from 'lucide-react'
import { useEffect } from 'react'
import type { TipoDocumento } from '../data/tiposDocumento'
import { tiposDocumento } from '../data/tiposDocumento'
import { GlassCard } from './GlassCard'

const icons: Record<string, LucideIcon> = {
  CC: IdCard,
  TI: GraduationCap,
  RC: Baby,
  CE: Globe,
  PEP: BadgeCheck,
  PPT: BadgeCheck,
  PA: Plane,
  DNI: Fingerprint,
  SC: Shield,
}

type Props = {
  open: boolean
  value: TipoDocumento
  onClose: () => void
  onSelect: (tipo: TipoDocumento) => void
}

export function TipoDocumentoPicker({ open, value, onClose, onSelect }: Props) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[420px] max-h-[78vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Tipo de documento"
      >
        <GlassCard className="flex max-h-[78vh] flex-col p-4">
          <div className="mb-3 flex items-start justify-between gap-2">
            <div>
              <h2 className="text-lg font-extrabold text-text">
                Tipo de documento
              </h2>
              <p className="text-xs text-muted">
                Elige el documento con el que consultarás
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full px-2 py-1 text-muted hover:bg-fill"
            >
              ✕
            </button>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto pr-1">
            {tiposDocumento.map((t) => {
              const Icon = icons[t.abreviatura] ?? FileText
              const selected = t.codigo === value.codigo
              return (
                <button
                  key={t.codigo}
                  type="button"
                  onClick={() => {
                    onSelect(t)
                    onClose()
                  }}
                  className={`btn-soft flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left ${
                    selected ? 'bg-blue-soft' : 'bg-fill'
                  }`}
                >
                  <span
                    className={`flex h-10 w-10 items-center justify-center rounded-xl border ${
                      selected
                        ? 'border-blue bg-blue text-white'
                        : 'border-border bg-white text-blue'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span
                      className={`block text-sm font-extrabold ${
                        selected ? 'text-blue' : 'text-text'
                      }`}
                    >
                      {t.abreviatura}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {t.nombre}
                    </span>
                  </span>
                  {selected ? (
                    <BadgeCheck className="h-5 w-5 text-blue" />
                  ) : null}
                </button>
              )
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  )
}
