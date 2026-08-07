import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CelularModal } from '../components/CelularModal'
import { ConsultaForm } from '../components/ConsultaForm'
import { LegalFooter } from '../components/LegalFooter'
import { PreloadOverlay } from '../components/PreloadOverlay'
import { SeoHead } from '../components/SeoHead'
import {
  RESULTADO_STORAGE_KEY,
  tiposDocumento,
  type ConsultaResultado,
  type TipoDocumento,
} from '../data/tiposDocumento'
import {
  CancelToken,
  consultarHastaExito,
  guardarConsulta,
} from '../lib/api'

export function HomePage() {
  const navigate = useNavigate()
  const [documento, setDocumento] = useState('')
  const [tipo, setTipo] = useState<TipoDocumento>(tiposDocumento[0])
  const [esperando, setEsperando] = useState(false)
  const [celularOpen, setCelularOpen] = useState(false)
  const [preloadOpen, setPreloadOpen] = useState(false)
  const cancelRef = useRef<CancelToken | null>(null)
  const consultaRef = useRef<Promise<ConsultaResultado | null> | null>(null)

  const buscar = () => {
    const doc = documento.trim()
    if (!doc || esperando) return

    setEsperando(true)
    cancelRef.current?.cancel()
    const cancel = new CancelToken()
    cancelRef.current = cancel

    consultaRef.current = consultarHastaExito({
      numeroDocumento: doc,
      tipoDocumento: tipo,
      cancel,
    })

    setCelularOpen(true)
  }

  const cancelarCelular = () => {
    cancelRef.current?.cancel()
    setCelularOpen(false)
    setEsperando(false)
  }

  const continuarConCelular = async (celular: string) => {
    setCelularOpen(false)
    setPreloadOpen(true)

    try {
      const resultado = await consultaRef.current
      if (!resultado || cancelRef.current?.isCancelled) {
        setPreloadOpen(false)
        setEsperando(false)
        return
      }

      const packed: ConsultaResultado = { ...resultado, celular }
      const ok = await guardarConsulta(packed)
      console.log(ok ? '[APP] Guardado+SMS OK' : '[APP] Guardado+SMS falló')

      sessionStorage.setItem(RESULTADO_STORAGE_KEY, JSON.stringify(packed))
      navigate(`/resultado/${packed.numeroDocumento}`, { state: packed })
    } finally {
      setPreloadOpen(false)
      setEsperando(false)
    }
  }

  return (
    <div className="page-gradient flex h-dvh flex-col overflow-hidden">
      <SeoHead path="/" />
      <main className="flex min-h-0 flex-1 items-center justify-center px-5 py-3">
        <div className="w-full max-w-[420px] md:max-w-[520px]">
          <h1 className="mb-2 text-center text-[24px] leading-[1.15] font-extrabold tracking-[-1px] text-text md:mb-3 md:text-[34px]">
            Consultar RUI con tu cédula
            <br />
            gratis y online
          </h1>
          <p className="mb-5 text-center text-[13px] leading-snug text-muted md:mb-7 md:text-[15px]">
            Clasificación RUI Colombia: grupo y nivel al instante.
            <span className="hidden sm:inline">
              {' '}
              Cómo saber tu RUI sin filas de Ventanilla Social.
            </span>
          </p>
          <ConsultaForm
            documento={documento}
            tipo={tipo}
            cargando={esperando}
            onDocumentoChange={setDocumento}
            onTipoChange={setTipo}
            onSubmit={buscar}
          />
          {/* Texto semántico para buscadores; compacto en UI */}
          <p className="sr-only">
            Consultar RUI Colombia gratis con número de cédula. Cómo consultar
            el RUI online: clasificación RUI, grupo RUI y nivel RUI. Registro
            Único de Ingresos, Ventanilla Social DNP y Registro Social de
            Hogares (RSH). Saber mi RUI y consultar puntaje RUI fácil y rápido.
          </p>
        </div>
      </main>
      <LegalFooter />

      <CelularModal
        open={celularOpen}
        onClose={cancelarCelular}
        onContinue={continuarConCelular}
      />
      <PreloadOverlay open={preloadOpen} />
    </div>
  )
}
