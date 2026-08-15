import { ref, watch } from 'vue'

const STORAGE_KEY = 'v_movie_theme'
const isDark = ref(false)
let initialized = false

function applyTheme(dark) {
  const root = document.documentElement
  if (dark) {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

function getInitialTheme() {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved === 'dark') return true
  if (saved === 'light') return false
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function initTheme() {
  if (initialized) return
  initialized = true
  isDark.value = getInitialTheme()
  applyTheme(isDark.value)

  watch(isDark, (dark) => {
    applyTheme(dark)
    localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light')
  })
}

export function useTheme() {
  return { isDark }
}
