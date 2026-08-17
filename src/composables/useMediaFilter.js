import { ref, computed, watch, onBeforeUnmount } from "vue";

export function useMediaFilter(listRef, options = {}) {
  const { debounceMs = 200 } = options;
  const keywordRaw = ref("");
  const keyword = ref("");
  const genre = ref("");
  let debounceTimer = null;

  watch(keywordRaw, (v) => {
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      keyword.value = v;
    }, debounceMs);
  });

  onBeforeUnmount(() => {
    if (debounceTimer) clearTimeout(debounceTimer);
  });

  const genres = computed(() => {
    const set = new Set();
    (listRef.value || []).forEach((item) => {
      (item.genre || []).forEach((g) => set.add(g));
    });
    return [...set];
  });

  function matchKeyword(item, kw) {
    if (!kw) return true;
    const hay = [item.title, item.originalTitle]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    return hay.includes(kw);
  }

  const filtered = computed(() => {
    const kw = keyword.value.trim().toLowerCase();
    const g = genre.value;
    return (listRef.value || []).filter((item) => {
      const matchGenre = !g || (item.genre || []).includes(g);
      return matchGenre && matchKeyword(item, kw);
    });
  });

  return {
    keyword: keywordRaw,
    debouncedKeyword: keyword,
    genre,
    genres,
    filtered,
  };
}
