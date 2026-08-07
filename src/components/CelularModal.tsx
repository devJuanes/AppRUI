import { ArrowRight, MessageSquareText, Smartphone, X } from 'lucide-react'
import { useEffect, useState } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  onContinue: (celular: string) => void
}

export function CelularModal({ open, onClose, onContinue }: Props) {
  const [celular, setCelular] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setCelular('')
      setError(null)
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const submit = () => {
    const value = celular.trim()
    if (!value) {
      setError('Ingresa tu número de celular.')
      return
    }
    if (value.length !== 10) {
      setError('El celular debe tener 10 dígitos.')
      return
    }
    onContinue(value)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[380px] animate-[fadeIn_0.22s_ease-out]">
        <div className="relative overflow-hidden rounded-[26px] bg-white px-5 pt-4 pb-4 shadow-[0_16px_40px_rgb(0_0_0/0.14)]">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-blue-soft/80 to-transparent" />

          <div className="relative flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn-soft flex h-8 w-8 items-center justify-center rounded-full bg-fill text-muted"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" strokeWidth={2.25} />
            </button>
          </div>

          <div className="relative mx-auto mt-1 flex h-[72px] w-[72px] items-center justify-center">
            <div className="absolute inset-0 rounded-[22px] bg-gradient-to-br from-[#5AC8FA] to-blue opacity-20 blur-md" />
            <div className="relative flex h-full w-full items-center justify-center rounded-[22px] bg-gradient-to-br from-[#5AC8FA] to-blue shadow-lg shadow-blue/25">
              <Smartphone className="h-8 w-8 text-white" strokeWidth={2} />
              <span className="absolute -right-1 -bottom-1 flex h-7 w-7 items-center justify-center rounded-full border-[3px] border-white bg-green shadow-sm">
                <MessageSquareText className="h-3.5 w-3.5 text-white" strokeWidth={2.5} />
              </span>
            </div>
          </div>

          <h2 className="relative mt-5 text-center text-[21px] leading-[1.2] font-extrabold tracking-[-0.5px] text-text">
            ¿A qué celular te
            <br />
            enviamos el resultado?
          </h2>
          <p className="relative mt-2 text-center text-[13px] leading-relaxed text-muted">
            Te llegará un SMS con tu clasificación RUI.
            <br />
            Solo lo usamos para esta notificación.
          </p>

          <label className="relative mt-5 block">
            <span className="mb-1.5 block text-center text-xs font-semibold text-muted">
              Número de celular
            </span>
            <div className="relative">
              <Smartphone className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-muted" />
              <input
                autoFocus
                value={celular}
                onChange={(e) => {
                  setCelular(e.target.value.replace(/\D/g, '').slice(0, 10))
                  setError(null)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit()
                }}
                inputMode="numeric"
                placeholder="300 123 4567"
                className={`w-full rounded-2xl bg-fill py-3 pr-3.5 pl-10 text-center text-lg font-bold tracking-[0.18em] text-text outline-none transition placeholder:tracking-normal placeholder:font-medium placeholder:text-muted/60 focus:ring-[1.5px] ${
                  error ? 'ring-[1.5px] ring-red' : 'focus:ring-blue'
                }`}
              />
            </div>
            <p className="mt-1.5 text-center text-[11px] text-muted">
              {celular.length}/10 dígitos
            </p>
          </label>

          {error ? (
            <p className="mt-1 text-center text-sm font-medium text-red">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={submit}
            className="btn-primary mt-3 w-full py-2.5 text-[15px]"
          >
            Continuar
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </button>
          <button
            type="button"
            onClick={onClose}
            className="btn-ghost mt-1 w-full py-2 text-sm font-medium text-muted"
          >
            Cancelar consulta
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
