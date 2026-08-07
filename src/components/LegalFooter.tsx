export function LegalFooter() {
  return (
    <footer className="px-5 pb-3 pt-1 text-center">
      <p className="text-[10px] leading-snug text-muted sm:text-[11px]">
        <span className="sm:hidden">
          Consultar RUI Colombia · RSH / Ventanilla Social DNP · Uso informativo.
        </span>
        <span className="hidden sm:inline">
          Consulta tu clasificación RUI con cédula. La información proviene del
          RSH / Ventanilla Social (DNP). Consultar no es un sitio oficial del
          Gobierno; el uso es informativo.
        </span>
      </p>
      <p className="mt-1 text-[10px] leading-snug text-muted/80 sm:text-[11px]">
        <a className="underline-offset-2 hover:underline" href="/consulta-rui-cedula.html">
          Consulta RUI cédula
        </a>
        {' · '}
        <a className="underline-offset-2 hover:underline" href="/consultar-rui-online.html">
          Consultar RUI online
        </a>
        {' · '}
        <a
          className="underline-offset-2 hover:underline"
          href="/clasificacion-rui-colombia.html"
        >
          Clasificación RUI
        </a>
      </p>
    </footer>
  )
}
