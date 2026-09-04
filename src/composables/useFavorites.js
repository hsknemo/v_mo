import { ref, computed } from "vue";

const STORAGE_KEY = "v_movie_favorites";

// 类型标签映射
export const TYPE_LABELS = {
    movie: "电影",
    tv: "电视剧",
    ustv: "美剧",
    krtv: "韩剧",
    variety: "综艺",
    anime: "动漫",
    food: "下饭",
};

function loadFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return [];
        const arr = JSON.parse(raw);
        return Array.isArray(arr) ? arr : [];
    } catch {
        return [];
    }
}

// 模块级共享 ref，所有组件共用同一份数据
const favorites = ref(loadFromStorage());

function save() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites.value));
}

// 收藏唯一标识：来源类型 + 片名（id 会随数据增删动态变化，不可作为匹配依据）
function favKey(sourceType, title) {
    return `${sourceType}_${title}`;
}

export function useFavorites() {
    function isFavorited(sourceType, title) {
        const key = favKey(sourceType, title);
        return favorites.value.some((f) => favKey(f.sourceType, f.title) === key);
    }

    function toggleFavorite(item, sourceType) {
        const key = favKey(sourceType, item.title);
        const idx = favorites.value.findIndex(
            (f) => favKey(f.sourceType, f.title) === key,
        );
        if (idx >= 0) {
            favorites.value.splice(idx, 1);
        } else {
            favorites.value.push({
                // id 仅作跳转参考，会在每次收藏时刷新为当前最新值
                id: item.id,
                title: item.title,
                poster: item.poster || "",
                year: item.year || "",
                rating: item.rating || "",
                sourceType,
                addedAt: Date.now(),
            });
        }
        save();
    }

    function removeFavorite(sourceType, title) {
        const key = favKey(sourceType, title);
        const idx = favorites.value.findIndex(
            (f) => favKey(f.sourceType, f.title) === key,
        );
        if (idx >= 0) {
            favorites.value.splice(idx, 1);
            save();
        }
    }

    // 按来源类型分组，只包含有收藏的类型
    const grouped = computed(() => {
        const map = {};
        favorites.value.forEach((f) => {
            if (!map[f.sourceType]) map[f.sourceType] = [];
            map[f.sourceType].push(f);
        });
        return map;
    });

    const count = computed(() => favorites.value.length);

    return {
        favorites,
        isFavorited,
        toggleFavorite,
        removeFavorite,
        grouped,
        count,
    };
}