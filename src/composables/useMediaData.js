import { ref } from 'vue'
import site from '@/config/site'

const cache = {}
const listMap = {}
const loadingMap = {}
const errorMap = {}

function getUrl(type) {
  const entry = site.dataSources[type]
  if (!entry) throw new Error(`未知的数据类型: ${type}`)
  return entry
}

export function useMediaData(type) {
  if (!listMap[type]) listMap[type] = ref([])
  if (!loadingMap[type]) loadingMap[type] = ref(false)
  if (!errorMap[type]) errorMap[type] = ref('')

  const list = listMap[type]
  const loading = loadingMap[type]
  const error = errorMap[type]

  async function load() {
    if (cache[type]) {
      list.value = cache[type]
      return
    }
    loading.value = true
    error.value = ''
    try {
      const res = await fetch(getUrl(type))
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      const arr = Array.isArray(data) ? data : data.list || []
      cache[type] = arr
      list.value = arr
    } catch (e) {
      error.value = '数据加载失败，请稍后重试'
      list.value = []
    } finally {
      loading.value = false
    }
  }

  return { list, loading, error, load }
}
