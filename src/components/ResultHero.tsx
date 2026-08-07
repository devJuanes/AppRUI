import { BadgeCheck, IdCard, MapPin, Users } from 'lucide-react'
import type { ConsultaResultado } from '../data/tiposDocumento'
import { GlassCard } from './GlassCard'
import { SexAvatar } from './SexAvatar'

type Props = {
  resultado: ConsultaResultado
  onOpenFicha: () => void
}

export function ResultHero({ resultado: r, onOpenFicha }: Props) {
  const meta = [
    {
      icon: Users,
      text: [r.edad ? `${r.edad} años` : '', r.sexo].filter(Boolean).join(' · '),
    },
    {
      icon: MapPin,
      text: [r.municipio, r.departamento].filter(Boolean).join(' — '),
    },
    {
      icon: IdCard,
      text: `${r.tipoDocumento.abreviatura} ${r.numeroDocumento}`,
    },
  ].filter((m) => m.text)

  return (
    <GlassCard className="p-5 sm:p-7" onClick={onOpenFicha}>
      <div className="flex justify-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-soft px-2.5 py-1 text-xs font-semibold text-blue">
          <BadgeCheck className="h-3.5 w-3.5" />
          Consulta exitosa
        </span>
      </div>

      <div className="mt-5 flex flex-col items-center text-center">
        <SexAvatar sexo={r.sexo} size={96} />
        <h1 className="mt-4 text-[22px] font-extrabold tracking-tight text-text sm:text-[28px]">
          {r.nombre || 'Sin nombre'}
        </h1>
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {meta.map((m) => (
            <span
              key={m.text}
              className="inline-flex items-center gap-1.5 rounded-full bg-fill px-2.5 py-1.5 text-[13px] font-medium text-text-secondary"
            >
              <m.icon className="h-3.5 w-3.5 text-muted" />
              {m.text}
            </span>
          ))}
        </div>

        <div className="mt-5 w-[128px] rounded-[18px] border border-green/35 bg-green-soft p-3">
          <p className="text-center text-[9px] font-bold tracking-wide text-green">
            CLASIFICACIÓN RUI
          </p>
          <p className="mt-1 text-center text-[30px] font-extrabold leading-none text-text">
            {r.grupRui || '—'}
          </p>
          <div className="mt-2 rounded-full bg-green px-2 py-1.5 text-center text-[11px] font-semibold text-white">
            {r.nivelRui || 'Sin nivel'}
          </div>
        </div>
      </div>
    </GlassCard>
  )
}
