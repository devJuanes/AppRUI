export const SITE_URL =
  import.meta.env.VITE_SITE_URL?.trim() ||
  (typeof window !== 'undefined' ? window.location.origin : 'https://rui.matubyte.com')

export const SITE_SHARE_LABEL = SITE_URL.replace(/^https?:\/\//, '')
