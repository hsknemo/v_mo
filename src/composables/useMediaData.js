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

// genre / cast 兼容处理：可能是数组，也可能是 JSON 字符串（如 "[\"喜剧\",\"动画\"]"）
function normalizeStringArray(val) {
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.trim()) {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
    } catch (e) {
      // 非 JSON 字符串，按常见分隔符拆分兜底
      return val.split(/[,，、\s]+/).filter(Boolean);
    }
  }
  return [];
}

function assignIds(arr) {
  if (!Array.isArray(arr)) return [];
  return arr.map((item, i) => {
    const withId = {
      ...item,
      id: i + 1,
      genre: normalizeStringArray(item.genre),
      cast: normalizeStringArray(item.cast),
    };
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
