<template>
  <div class="media-filter">
    <el-input
      :model-value="keyword"
      placeholder="搜索标题 / 演员 / 导演"
      clearable
      class="search-input"
      :prefix-icon="Search"
      @update:model-value="onKeyword"
    />
    <el-select
      :model-value="genre"
      placeholder="全部类型"
      clearable
      class="genre-select"
      @update:model-value="onGenre"
    >
      <el-option
        v-for="g in genres"
        :key="g"
        :label="g"
        :value="g"
      />
    </el-select>
  </div>
</template>

<script setup>
import { Search } from '@element-plus/icons-vue'

defineProps({
  keyword: { type: String, default: '' },
  genre: { type: String, default: '' },
  genres: { type: Array, default: () => [] }
})

const emit = defineEmits(['update:keyword', 'update:genre'])

function onKeyword(val) {
  emit('update:keyword', val)
}
function onGenre(val) {
  emit('update:genre', val)
}
</script>

<style scoped lang="scss">
.media-filter {
  display: flex;
  gap: $space-md;
  margin-bottom: $space-lg;
  flex-wrap: wrap;

  .search-input {
    flex: 1;
    min-width: 220px;
    max-width: 360px;
  }

  .genre-select {
    width: 160px;
  }

  @media (max-width: $bp-mobile) {
    .search-input {
      max-width: none;
    }
    .genre-select {
      flex: 1;
      width: auto;
    }
  }
}
</style>
