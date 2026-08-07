import { Globe2 } from 'lucide-react'

export function Header() {
  return (
    <header className="px-4 pt-3">
      <div className="glass flex items-center gap-3 rounded-[18px] px-3.5 py-2.5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-[#5AC8FA] via-blue to-indigo shadow-md shadow-blue/25">
          <Globe2 className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-extrabold tracking-tight text-text">
          Consultar
        </span>
      </div>
    </header>
  )
}
