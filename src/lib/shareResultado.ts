import { SITE_SHARE_LABEL, SITE_URL } from '../config/site'
import type { ConsultaResultado } from '../data/tiposDocumento'

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2)
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.arcTo(x + w, y, x + w, y + h, radius)
  ctx.arcTo(x + w, y + h, x, y + h, radius)
  ctx.arcTo(x, y + h, x, y, radius)
  ctx.arcTo(x, y, x + w, y, radius)
  ctx.closePath()
}

function fitText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  font: string,
) {
  ctx.font = font
  if (ctx.measureText(text).width <= maxWidth) return text
  let t = text
  while (t.length > 0 && ctx.measureText(`${t}…`).width > maxWidth) {
    t = t.slice(0, -1)
  }
  return `${t}…`
}

/** Genera PNG del resultado RUI (sin URL/marca de agua en la imagen). */
export async function generateResultadoImage(
  r: ConsultaResultado,
): Promise<Blob> {
  const width = 1080
  const height = 1350
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas no disponible')

  const grad = ctx.createLinearGradient(0, 0, width, height)
  grad.addColorStop(0, '#F8FAFF')
  grad.addColorStop(0.5, '#F2F4F8')
  grad.addColorStop(1, '#EEF6FF')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, width, height)

  // Card
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0,0,0,0.08)'
  ctx.shadowBlur = 40
  ctx.shadowOffsetY = 16
  roundRect(ctx, 60, 80, width - 120, height - 160, 48)
  ctx.fill()
  ctx.shadowColor = 'transparent'

  // Badge
  ctx.fillStyle = '#E8F1FF'
  roundRect(ctx, width / 2 - 170, 130, 340, 56, 28)
  ctx.fill()
  ctx.fillStyle = '#007AFF'
  ctx.font = '600 28px "Segoe UI", system-ui, sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText('Consulta RUI exitosa', width / 2, 168)

  // Nombre
  ctx.fillStyle = '#1C1C1E'
  ctx.font = '800 48px "Segoe UI", system-ui, sans-serif'
  const nombre = fitText(
    ctx,
    r.nombre || 'Sin nombre',
    width - 200,
    '800 48px "Segoe UI", system-ui, sans-serif',
  )
  ctx.fillText(nombre, width / 2, 280)

  // Meta
  ctx.fillStyle = '#8E8E93'
  ctx.font = '500 28px "Segoe UI", system-ui, sans-serif'
  const meta = [
    r.edad ? `${r.edad} años` : '',
    r.sexo,
    `${r.tipoDocumento.abreviatura} ${r.numeroDocumento}`,
  ]
    .filter(Boolean)
    .join('  ·  ')
  ctx.fillText(
    fitText(ctx, meta, width - 200, '500 28px "Segoe UI", system-ui, sans-serif'),
    width / 2,
    340,
  )

  const lugar = [r.municipio, r.departamento].filter(Boolean).join(' — ')
  if (lugar) {
    ctx.fillText(
      fitText(ctx, lugar, width - 200, '500 28px "Segoe UI", system-ui, sans-serif'),
      width / 2,
      390,
    )
  }

  // Clasificación box
  const boxW = 360
  const boxH = 320
  const boxX = (width - boxW) / 2
  const boxY = 470
  ctx.fillStyle = '#E8F8EE'
  roundRect(ctx, boxX, boxY, boxW, boxH, 36)
  ctx.fill()
  ctx.strokeStyle = 'rgba(52, 199, 89, 0.35)'
  ctx.lineWidth = 3
  roundRect(ctx, boxX, boxY, boxW, boxH, 36)
  ctx.stroke()

  ctx.fillStyle = '#34C759'
  ctx.font = '700 22px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('CLASIFICACIÓN RUI', width / 2, boxY + 70)

  ctx.fillStyle = '#1C1C1E'
  ctx.font = '800 140px "Segoe UI", system-ui, sans-serif'
  ctx.fillText(r.grupRui || '—', width / 2, boxY + 200)

  ctx.fillStyle = '#34C759'
  roundRect(ctx, boxX + 40, boxY + 230, boxW - 80, 56, 28)
  ctx.fill()
  ctx.fillStyle = '#FFFFFF'
  ctx.font = '700 28px "Segoe UI", system-ui, sans-serif'
  ctx.fillText(r.nivelRui || 'Sin nivel', width / 2, boxY + 268)

  // Extra rows
  const rows: [string, string][] = [
    ['Ingresos', r.grupoIngresos || 'No reportado'],
    ['Documento', `${r.tipoDocumento.abreviatura} ${r.numeroDocumento}`],
  ]
  let y = 860
  for (const [label, value] of rows) {
    ctx.fillStyle = '#F2F2F7'
    roundRect(ctx, 120, y, width - 240, 88, 20)
    ctx.fill()
    ctx.textAlign = 'left'
    ctx.fillStyle = '#8E8E93'
    ctx.font = '600 24px "Segoe UI", system-ui, sans-serif'
    ctx.fillText(label, 150, y + 36)
    ctx.fillStyle = '#1C1C1E'
    ctx.font = '700 28px "Segoe UI", system-ui, sans-serif'
    ctx.fillText(
      fitText(ctx, value, width - 320, '700 28px "Segoe UI", system-ui, sans-serif'),
      150,
      y + 70,
    )
    ctx.textAlign = 'center'
    y += 108
  }

  ctx.fillStyle = '#8E8E93'
  ctx.font = '500 22px "Segoe UI", system-ui, sans-serif'
  ctx.fillText('Fuente: RSH / Ventanilla Social DNP', width / 2, height - 120)

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error('No se pudo generar la imagen'))
      },
      'image/png',
      1,
    )
  })
}

export function buildShareText(r: ConsultaResultado) {
  return [
    `Mi clasificación RUI: ${r.grupRui || '—'} · ${r.nivelRui || 'Sin nivel'}`,
    r.nombre ? `${r.nombre}` : null,
    [r.municipio, r.departamento].filter(Boolean).join(' — ') || null,
    '',
    `Consulta la tuya aquí: ${SITE_URL}`,
  ]
    .filter((line) => line !== null)
    .join('\n')
}

export async function shareResultadoImage(r: ConsultaResultado): Promise<{
  mode: 'native' | 'whatsapp' | 'download'
}> {
  const blob = await generateResultadoImage(r)
  const file = new File([blob], `rui-${r.numeroDocumento || 'resultado'}.png`, {
    type: 'image/png',
  })
  const text = buildShareText(r)

  if (navigator.canShare?.({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: 'Mi clasificación RUI',
      text,
    })
    return { mode: 'native' }
  }

  // Fallback: descarga imagen + WhatsApp con texto + URL
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = file.name
  a.click()
  URL.revokeObjectURL(url)

  const wa = `https://wa.me/?text=${encodeURIComponent(text)}`
  window.open(wa, '_blank', 'noopener,noreferrer')
  return { mode: 'whatsapp' }
}

export function shareWhatsAppText(r: ConsultaResultado) {
  const text = buildShareText(r)
  window.open(
    `https://wa.me/?text=${encodeURIComponent(text)}`,
    '_blank',
    'noopener,noreferrer',
  )
}

export { SITE_SHARE_LABEL, SITE_URL }
