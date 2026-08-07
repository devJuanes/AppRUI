import { BarChart3, Map, UserRound } from 'lucide-react'
import type { ConsultaResultado } from '../data/tiposDocumento'
import { GlassCard } from './GlassCard'

function SectionCard({
  icon: Icon,
  title,
  subtitle,
  tip,
  colorClass,
  softClass,
  rows,
}: {
  icon: typeof UserRound
  title: string
  subtitle: string
  tip: string
  colorClass: string
  softClass: string
  rows: [string, string][]
}) {
  return (
    <GlassCard className="p-4">
      <div className="flex items-center gap-2.5">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-[14px] border ${softClass} ${colorClass}`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="text-[15px] font-bold text-text">{title}</h3>
          <p className="text-xs text-muted">{subtitle}</p>
        </div>
      </div>
      <div className={`mt-3 rounded-[10px] px-2.5 py-2 text-[11px] font-semibold ${softClass} ${colorClass}`}>
        {tip}
      </div>
      <div className="mt-2.5 space-y-1.5">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="flex items-start justify-between gap-3 rounded-xl bg-fill px-3 py-2.5"
          >
            <span className="text-xs font-semibold text-muted">{label}</span>
            <span className="text-right text-[13px] font-bold text-text">
              {value}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  )
}

export function SectionCards({ resultado: r }: { resultado: ConsultaResultado }) {
  return (
    <div className="grid gap-3 lg:grid-cols-3">
      <SectionCard
        icon={UserRound}
        title="Datos personales"
        subtitle="Identidad registrada"
        tip="Tip: verifica que el documento coincida con tu cédula."
        colorClass="text-blue"
        softClass="border-blue/15 bg-blue-soft"
        rows={[
          ['Documento', `${r.tipoDocumento.abreviatura} ${r.numeroDocumento}`],
          ['Tipo', r.tipoDocumento.nombre],
          ['Celular', r.celular || '—'],
          ['Sexo', r.sexo || '—'],
          ['Edad', r.edad ? `${r.edad} años` : '—'],
        ]}
      />
      <SectionCard
        icon={Map}
        title="Ubicación"
        subtitle="Residencia reportada"
        tip="Tip: municipio y departamento según RSH."
        colorClass="text-indigo"
        softClass="border-indigo/15 bg-[#EEEDFF]"
        rows={[
          ['Municipio', r.municipio || '—'],
          ['Departamento', r.departamento || '—'],
          ['Código DANE', r.codMpio || '—'],
          ['País', 'Colombia'],
        ]}
      />
      <SectionCard
        icon={BarChart3}
        title="Clasificación RUI"
        subtitle="Grupo y nivel"
        tip="Tip: el grupo (A/B/C…) resume tu clasificación."
        colorClass="text-green"
        softClass="border-green/15 bg-green-soft"
        rows={[
          ['Grupo RUI', r.grupRui || '—'],
          ['Nivel', r.nivelRui || '—'],
          ['Ingresos', r.grupoIngresos || 'No reportado'],
          ['Estado', 'Activo en consulta'],
        ]}
      />
    </div>
  )
}
