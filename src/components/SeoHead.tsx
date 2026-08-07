import { useEffect } from 'react'
import { SITE_URL } from '../config/site'

type Props = {
  title?: string
  description?: string
  path?: string
  noIndex?: boolean
}

const DEFAULT_TITLE =
  'Consultar RUI con cédula gratis | Clasificación RUI Colombia online'

const DEFAULT_DESCRIPTION =
  'Consulta tu RUI con cédula en Colombia gratis y online. Mira tu grupo y nivel RUI al instante. Alternativa rápida a Ventanilla Social / RSH (DNP).'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  )
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

function setLink(rel: string, href: string, id?: string) {
  let el = id
    ? document.getElementById(id)
    : document.head.querySelector(`link[rel="${rel}"]`)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    if (id) el.id = id
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Actualiza title/meta/canonical según la ruta (SPA). */
export function SeoHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  noIndex = false,
}: Props) {
  useEffect(() => {
    const origin = SITE_URL.replace(/\/$/, '')
    const url = `${origin}${path.startsWith('/') ? path : `/${path}`}`
    const image = `${origin}/og-image.png`

    document.title = title
    document.documentElement.lang = 'es-CO'

    setMeta('name', 'description', description)
    setMeta('name', 'robots', noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1')

    setMeta('property', 'og:title', title)
    setMeta('property', 'og:description', description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', image)
    setMeta('property', 'og:locale', 'es_CO')
    setMeta('property', 'og:type', 'website')

    setMeta('name', 'twitter:title', title)
    setMeta('name', 'twitter:description', description)
    setMeta('name', 'twitter:image', image)

    setLink('canonical', url, 'seo-canonical')

    const ogUrl = document.getElementById('seo-og-url')
    if (ogUrl) ogUrl.setAttribute('content', url)
    const ogImage = document.getElementById('seo-og-image')
    if (ogImage) ogImage.setAttribute('content', image)
    const twImage = document.getElementById('seo-twitter-image')
    if (twImage) twImage.setAttribute('content', image)
  }, [title, description, path, noIndex])

  return null
}
