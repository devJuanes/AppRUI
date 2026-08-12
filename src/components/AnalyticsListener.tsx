import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { trackPageview } from '../lib/analytics'

/** Envía pageview a GA4 en cada cambio de ruta. */
export function AnalyticsListener() {
  const location = useLocation()

  useEffect(() => {
    const path = `${location.pathname}${location.search}`
    trackPageview(path)
  }, [location.pathname, location.search])

  return null
}
