import { ref } from "vue";
import site from "@/config/site";

const cache = {};
const listMap = {};
const loadingMap = {};
const errorMap = {};

function getUrl(type) {
  const entry = site.dataSources[type];
  if (!entry) throw new Error(`未知的数据类型: ${type}`);
  return entry;
}

function assignIds(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item, i) => {
    const withId = { ...item, id: i + 1 };
    if (Array.isArray(withId.episodeList)) {
      withId.episodeList = withId.episodeList.map((ep, j) => ({
        ...ep,
        id: j + 1,
      }));
    }
    return withId;
  });
}

export function useMediaData(type) {
  if (!listMap[type]) listMap[type] = ref([]);
  if (!loadingMap[type]) loadingMap[type] = ref(false);
  if (!errorMap[type]) errorMap[type] = ref("");

  const list = listMap[type];
  const loading = loadingMap[type];
  const error = errorMap[type];

  async function load() {
    if (cache[type]) {
      list.value = cache[type];
      return;
    }
    loading.value = true;
    error.value = "";
    try {
      const res = await fetch(getUrl(type));
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const raw = Array.isArray(data) ? data : data.list || [];
      const processed = assignIds(raw);
      cache[type] = processed;
      list.value = processed;
    } catch (e) {
      error.value = "数据加载失败，请稍后重试";
      list.value = [];
    } finally {
      loading.value = false;
    }
  }

  return { list, loading, error, load };
}
