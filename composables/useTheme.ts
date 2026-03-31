const STORAGE_KEY = 'notes-app-theme'

export function useTheme() {
  const isDark = useState('theme-dark', () => false)

  function init(): void {
    if (typeof window === 'undefined') return

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      isDark.value = saved === 'dark'
    }
    else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }

    apply()
  }

  function toggle(): void {
    isDark.value = !isDark.value
    localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
    apply()
  }

  function apply(): void {
    if (typeof document === 'undefined') return
    document.documentElement.classList.toggle('dark', isDark.value)
  }

  return { isDark, init, toggle }
}
