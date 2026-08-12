const GA_ID = 'G-GCM07W628V'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

function ready(): boolean {
  return typeof window !== 'undefined' && typeof window.gtag === 'function'
}

/** Pageview en SPA (React Router). */
export function trackPageview(path: string, title?: string) {
  if (!ready()) return
  window.gtag('config', GA_ID, {
    page_path: path,
    page_title: title || document.title,
  })
}

/** Evento personalizado. */
export function trackEvent(
  name: string,
  params?: Record<string, string | number | boolean | undefined>,
) {
  if (!ready()) return
  window.gtag('event', name, params)
}
