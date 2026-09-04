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

// 拉取并处理数据，带模块级缓存，供页面加载与按片名查找共用
async function fetchList(type) {
    if (cache[type]) return cache[type];
    const res = await fetch(getUrl(type));
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const raw = Array.isArray(data) ? data : data.list || [];
    const processed = assignIds(raw);
    cache[type] = processed;
    return processed;
}

// 按片名查找当前数据中的条目（id 动态变化，片名才是稳定标识），找不到返回 null
export async function findMediaByTitle(type, title) {
    try {
        const list = await fetchList(type);
        return list.find((item) => item.title === title) || null;
    } catch {
        return null;
    }
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
            list.value = await fetchList(type);
        } catch (e) {
            error.value = "数据加载失败，请稍后重试";
            list.value = [];
        } finally {
            loading.value = false;
        }
    }

    return { list, loading, error, load };
}