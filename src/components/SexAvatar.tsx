import { UserRound } from 'lucide-react'

function parseSexo(sexo: string): boolean | null {
  const s = sexo.trim().toLowerCase()
  if (!s) return null
  if (s === 'f' || s.startsWith('fem') || s.includes('mujer') || s === 'femenino') {
    return true
  }
  if (
    s === 'm' ||
    s.startsWith('masc') ||
    s.includes('hombre') ||
    s === 'masculino'
  ) {
    return false
  }
  return null
}

type Props = {
  sexo: string
  size?: number
}

export function SexAvatar({ sexo, size = 96 }: Props) {
  const female = parseSexo(sexo)
  const ring =
    female === true
      ? 'from-[#FF9EB5] to-[#FF6B8A]'
      : female === false
        ? 'from-[#7DD3FC] to-blue'
        : 'from-[#A1A1AA] to-[#71717A]'

  return (
    <div
      className={`rounded-full bg-gradient-to-br p-[3px] shadow-lg ${ring}`}
      style={{ width: size, height: size }}
    >
      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-white">
        <div
          className={`flex h-full w-full items-end justify-center ${
            female === true
              ? 'bg-gradient-to-b from-[#FFE4EC] to-[#FFB7C8]'
              : female === false
                ? 'bg-gradient-to-b from-[#DBEAFE] to-[#93C5FD]'
                : 'bg-gradient-to-b from-[#E5E7EB] to-[#9CA3AF]'
          }`}
        >
          <UserRound
            className="mb-1 text-white drop-shadow"
            style={{ width: size * 0.62, height: size * 0.62 }}
            strokeWidth={1.5}
          />
        </div>
      </div>
    </div>
  )
}
