import { Download, Share2, X } from 'lucide-react'
import { useState } from 'react'
import type { ConsultaResultado } from '../data/tiposDocumento'
import {
  generateResultadoImage,
  shareResultadoImage,
  shareWhatsAppText,
  SITE_URL,
} from '../lib/shareResultado'

type Props = {
  open: boolean
  resultado: ConsultaResultado
  onClose: () => void
  onToast: (msg: string) => void
}

export function ShareModal({ open, resultado, onClose, onToast }: Props) {
  const [busy, setBusy] = useState(false)

  if (!open) return null

  const run = async (action: 'share' | 'whatsapp' | 'download') => {
    if (busy) return
    setBusy(true)
    try {
      if (action === 'share') {
        const { mode } = await shareResultadoImage(resultado)
        onToast(
          mode === 'native'
            ? 'Listo para compartir'
            : 'Imagen descargada · WhatsApp abierto',
        )
        onClose()
      } else if (action === 'whatsapp') {
        // Intenta compartir imagen; si no, al menos texto + URL
        try {
          await shareResultadoImage(resultado)
          onToast('Comparte la imagen y el mensaje')
        } catch {
          shareWhatsAppText(resultado)
          onToast('WhatsApp abierto con el mensaje')
        }
        onClose()
      } else {
        const blob = await generateResultadoImage(resultado)
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `rui-${resultado.numeroDocumento || 'resultado'}.png`
        a.click()
        URL.revokeObjectURL(url)
        onToast('Imagen descargada')
      }
    } catch (e) {
      console.error(e)
      onToast('No se pudo compartir. Intenta descargar la imagen.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/35 p-4 sm:items-center"
      onClick={onClose}
      role="presentation"
    >
      <div
        className="w-full max-w-[400px] animate-[fadeIn_0.2s_ease-out] rounded-[26px] bg-white p-5 shadow-[0_16px_40px_rgb(0_0_0/0.14)]"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-text">Compartir resultado</h2>
          <button
            type="button"
            onClick={onClose}
            className="btn-soft flex h-8 w-8 items-center justify-center rounded-full bg-fill text-muted"
            aria-label="Cerrar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <p className="mb-4 text-[13px] leading-relaxed text-muted">
          Se genera una imagen con tu clasificación RUI. El mensaje incluye el
          enlace: <span className="font-semibold text-text">{SITE_URL}</span>
        </p>

        <div className="space-y-2">
          <button
            type="button"
            disabled={busy}
            onClick={() => run('whatsapp')}
            className="btn-primary flex w-full items-center justify-center gap-2 py-3 text-[15px]"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5 fill-white" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-1.24.241a1.241 1.241 0 01-1.43-1.086 1.24 1.24 0 01.047-.373l.242-1.24-.215-.36a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            WhatsApp
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run('share')}
            className="btn-soft flex w-full items-center justify-center gap-2 rounded-[14px] border border-border bg-fill py-3 text-[15px] font-bold text-text"
          >
            <Share2 className="h-4 w-4 text-blue" />
            Redes / más opciones
          </button>
          <button
            type="button"
            disabled={busy}
            onClick={() => run('download')}
            className="btn-soft flex w-full items-center justify-center gap-2 rounded-[14px] border border-border bg-white py-3 text-[15px] font-semibold text-blue"
          >
            <Download className="h-4 w-4" />
            Descargar imagen
          </button>
        </div>

        {busy ? (
          <p className="mt-3 text-center text-xs text-muted">Generando imagen…</p>
        ) : null}
      </div>
    </div>
  )
}
