type Props = {
  open: boolean
  title?: string
  subtitle?: string
}

export function PreloadOverlay({
  open,
  title = 'Preparando tu resultado',
  subtitle = 'Guardando y abriendo tu ficha RUI…',
}: Props) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/35 p-4">
      <div className="glass w-full max-w-[340px] rounded-[22px] px-7 py-8 text-center">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-[20px] bg-gradient-to-br from-[#5AC8FA] to-blue shadow-lg shadow-blue/30">
          <span className="h-8 w-8 animate-spin rounded-full border-[3px] border-white/30 border-t-white" />
        </div>
        <h3 className="text-lg font-bold text-text">{title}</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">{subtitle}</p>
      </div>
    </div>
  )
}
