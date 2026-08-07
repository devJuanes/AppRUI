import {
  ChevronLeft,
  Copy,
  Info,
  Search,
  Share2,
  X,
} from 'lucide-react'
import { useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { FichaModal } from '../components/FichaModal'
import { GlassCard } from '../components/GlassCard'
import { ResultHero } from '../components/ResultHero'
import { SectionCards } from '../components/SectionCards'
import { SeoHead } from '../components/SeoHead'
import { ShareModal } from '../components/ShareModal'
import {
  RESULTADO_STORAGE_KEY,
  type ConsultaResultado,
} from '../data/tiposDocumento'

function readResultado(
  state: unknown,
  documentoParam?: string,
): ConsultaResultado | null {
  if (state && typeof state === 'object' && 'numeroDocumento' in state) {
    return state as ConsultaResultado
  }
  try {
    const raw = sessionStorage.getItem(RESULTADO_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as ConsultaResultado
    if (documentoParam && parsed.numeroDocumento !== documentoParam) return null
    return parsed
  } catch {
    return null
  }
}

export function ResultadoPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { documento } = useParams()
  const resultado = useMemo(
    () => readResultado(location.state, documento),
    [location.state, documento],
  )
  const [fichaOpen, setFichaOpen] = useState(false)
  const [shareOpen, setShareOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const showToast = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(null), 2500)
  }

  if (!resultado) {
    return (
      <div className="page-gradient flex h-dvh flex-col items-center justify-center gap-4 px-6">
        <p className="text-center text-muted">
          No hay resultado para mostrar. Realiza una consulta nueva.
        </p>
        <button
          type="button"
          onClick={() => navigate('/')}
          className="btn-primary rounded-xl px-5 py-3 font-bold text-white"
        >
          Ir al inicio
        </button>
      </div>
    )
  }

  const r = resultado

  const copiar = async () => {
    const text = [
      r.nombre,
      `${r.tipoDocumento.abreviatura} ${r.numeroDocumento}`,
      r.celular ? `Celular: ${r.celular}` : '',
      `${r.edad ? `${r.edad} años` : '—'} · ${r.sexo}`,
      `${r.municipio} — ${r.departamento}`,
      `Clasificación RUI: ${r.grupRui} · ${r.nivelRui}`,
    ]
      .filter(Boolean)
      .join('\n')
    await navigator.clipboard.writeText(text)
    showToast('Resumen copiado')
  }

  return (
    <div className="page-gradient min-h-dvh">
      <SeoHead
        path={`/resultado/${r.numeroDocumento}`}
        title={`Resultado RUI ${r.grupRui || ''} ${r.nivelRui || ''} | Consultar RUI`}
        description="Resultado privado de tu consulta RUI. Para una nueva consulta usa la página de inicio."
        noIndex
      />
      <div className="mx-auto flex min-h-dvh max-w-[980px] flex-col px-4 pb-8 sm:px-8">
        <header className="pt-3">
          <GlassCard className="flex items-center gap-2 rounded-[18px] px-2.5 py-2">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-soft rounded-full p-1.5 text-blue"
              aria-label="Volver"
            >
              <ChevronLeft className="h-7 w-7" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-gradient-to-br from-blue to-[#5AC8FA]">
              <Search className="h-4 w-4 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-base font-bold text-text">
                Consulta RUI
              </p>
              <p className="truncate text-xs text-muted">
                Reporte oficial · Ventanilla Social
              </p>
            </div>
            <button
              type="button"
              onClick={copiar}
              className="btn-soft hidden items-center gap-1 rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-blue sm:inline-flex"
            >
              <Copy className="h-4 w-4" />
              Copiar
            </button>
            <button
              type="button"
              onClick={() => setFichaOpen(true)}
              className="btn-soft inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-2 text-sm font-semibold text-blue"
            >
              <Info className="h-4 w-4" />
              <span className="hidden sm:inline">Detalles</span>
              <span className="sm:hidden">Info</span>
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-soft rounded-full p-1.5 text-muted"
              aria-label="Cerrar"
            >
              <X className="h-5 w-5" />
            </button>
          </GlassCard>
        </header>

        <main className="mt-3 flex-1 space-y-4 animate-[fadeIn_0.45s_ease-out]">
          <ResultHero resultado={r} onOpenFicha={() => setFichaOpen(true)} />
          <SectionCards resultado={r} />

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="btn-soft flex flex-1 items-center justify-center gap-2 rounded-[14px] border border-border bg-white py-3.5 font-semibold text-blue"
            >
              <Search className="h-4 w-4" />
              Nueva consulta
            </button>
            <button
              type="button"
              onClick={() => setShareOpen(true)}
              className="btn-primary flex-1 py-3.5 text-[15px] font-semibold"
            >
              <Share2 className="h-4 w-4" />
              Compartir
            </button>
          </div>
        </main>
      </div>

      <FichaModal
        open={fichaOpen}
        resultado={r}
        onClose={() => setFichaOpen(false)}
      />
      <ShareModal
        open={shareOpen}
        resultado={r}
        onClose={() => setShareOpen(false)}
        onToast={showToast}
      />

      {toast ? (
        <div className="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-xl bg-text px-4 py-2.5 text-sm text-white shadow-lg">
          {toast}
        </div>
      ) : null}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
