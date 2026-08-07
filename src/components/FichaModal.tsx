import type { ConsultaResultado } from '../data/tiposDocumento'
import { GlassCard } from './GlassCard'
import { SexAvatar } from './SexAvatar'

type Props = {
  open: boolean
  resultado: ConsultaResultado
  onClose: () => void
}

export function FichaModal({ open, resultado: r, onClose }: Props) {
  if (!open) return null

  const filas: [string, string][] = [
    ['Nombre', r.nombre || '—'],
    ['Documento', `${r.tipoDocumento.abreviatura} ${r.numeroDocumento}`],
    ['Tipo', r.tipoDocumento.nombre],
    ['Celular', r.celular || '—'],
    ['Sexo', r.sexo || '—'],
    ['Edad', r.edad ? `${r.edad} años` : '—'],
    ['Grupo RUI', r.grupRui || '—'],
    ['Nivel RUI', r.nivelRui || '—'],
    ['Grupo de ingresos', r.grupoIngresos || '—'],
    ['Municipio', r.municipio || '—'],
    ['Departamento', r.departamento || '—'],
    ['Código municipio', r.codMpio || '—'],
    ['Fuente', 'RSH / Ventanilla Social DNP'],
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[420px] max-h-[82vh]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <GlassCard className="flex max-h-[82vh] flex-col p-5">
          <div className="mb-2 flex items-center">
            <div className="w-10" />
            <h2 className="flex-1 text-center text-lg font-bold text-text">
              Ficha completa
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="w-10 text-muted hover:text-text"
            >
              ✕
            </button>
          </div>
          <div className="mb-3 flex flex-col items-center">
            <SexAvatar sexo={r.sexo} size={72} />
            <p className="mt-2 text-center text-base font-bold text-text">
              {r.nombre || 'Sin nombre'}
            </p>
          </div>
          <div className="min-h-0 flex-1 space-y-2 overflow-y-auto">
            {filas.map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl bg-fill px-3.5 py-2.5 text-center"
              >
                <p className="text-[11px] font-semibold tracking-wide text-muted">
                  {label}
                </p>
                <p className="mt-0.5 text-sm font-bold text-text">{value}</p>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-primary mt-3 w-full py-3.5"
          >
            Listo
          </button>
        </GlassCard>
      </div>
    </div>
  )
}
