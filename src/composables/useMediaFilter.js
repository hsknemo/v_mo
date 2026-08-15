import { ref, computed } from 'vue'

export function useMediaFilter(listRef) {
  const keyword = ref('')
  const genre = ref('')

  const genres = computed(() => {
    const set = new Set()
    ;(listRef.value || []).forEach((item) => {
      ;(item.genre || []).forEach((g) => set.add(g))
    })
    return [...set]
  })

  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase()
    const g = genre.value
    return (listRef.value || []).filter((item) => {
      const matchGenre = !g || (item.genre || []).includes(g)
      if (!matchGenre) return false
      if (!kw) return true
      const haystack = [
        item.title,
        item.originalTitle,
        item.director,
        ...(item.cast || [])
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
      return haystack.includes(kw)
    })
  })

  return { keyword, genre, genres, filtered }
}
