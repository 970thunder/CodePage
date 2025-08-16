<template>
  <div class="search-filter bg-base-200 p-6 rounded-lg">
    <!-- 搜索框 -->
    <div class="form-control mb-4">
      <div class="input-group">
        <input 
          v-model="searchQuery"
          type="text" 
          placeholder="搜索代码片段..." 
          class="input input-bordered w-full"
          @input="handleSearch"
        />
        <button class="btn btn-square btn-primary">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <!-- 语言筛选 -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">编程语言</span>
        </label>
        <select v-model="selectedLanguage" class="select select-bordered" @change="handleFilter">
          <option value="">全部语言</option>
          <option v-for="lang in languages" :key="lang.name" :value="lang.name">
            {{ lang.name }} ({{ lang.count }})
          </option>
        </select>
      </div>

      <!-- 分类筛选 -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">分类</span>
        </label>
        <select v-model="selectedCategory" class="select select-bordered" @change="handleFilter">
          <option value="">全部分类</option>
          <option v-for="cat in categories" :key="cat.name" :value="cat.name">
            {{ cat.name }} ({{ cat.count }})
          </option>
        </select>
      </div>

      <!-- 排序 -->
      <div class="form-control">
        <label class="label">
          <span class="label-text">排序</span>
        </label>
        <select v-model="sortBy" class="select select-bordered" @change="handleFilter">
          <option value="createdAt">创建时间</option>
          <option value="updatedAt">更新时间</option>
          <option value="views">浏览次数</option>
          <option value="likes">点赞数</option>
          <option value="title">标题</option>
        </select>
      </div>
    </div>

    <!-- 标签筛选 -->
    <div v-if="tags.length > 0" class="mb-4">
      <label class="label">
        <span class="label-text">标签筛选</span>
        <span class="label-text-alt">{{ selectedTags.length }} 个已选</span>
      </label>
      <div class="flex flex-wrap gap-2">
        <label 
          v-for="tag in tags" 
          :key="tag.name"
          class="cursor-pointer"
        >
          <input 
            type="checkbox" 
            :value="tag.name"
            v-model="selectedTags"
            class="checkbox checkbox-sm mr-2"
            @change="handleFilter"
          />
          <span class="badge badge-outline">{{ tag.name }} ({{ tag.count }})</span>
        </label>
      </div>
    </div>

    <!-- 清除筛选 -->
    <div v-if="hasActiveFilters" class="flex justify-between items-center">
      <div class="text-sm text-base-content/70">
        当前筛选: {{ activeFiltersText }}
      </div>
      <button @click="clearFilters" class="btn btn-ghost btn-sm">
        清除筛选
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'

const props = defineProps({
  languages: {
    type: Array,
    default: () => []
  },
  categories: {
    type: Array,
    default: () => []
  },
  tags: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits(['filter-change'])

const searchQuery = ref('')
const selectedLanguage = ref('')
const selectedCategory = ref('')
const selectedTags = ref([])
const sortBy = ref('createdAt')

// 防抖搜索
let searchTimeout = null

const handleSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    emitFilterChange()
  }, 300)
}

const handleFilter = () => {
  emitFilterChange()
}

const emitFilterChange = () => {
  const filters = {
    search: searchQuery.value,
    language: selectedLanguage.value,
    category: selectedCategory.value,
    tags: selectedTags.value,
    sortBy: sortBy.value
  }
  emit('filter-change', filters)
}

const clearFilters = () => {
  searchQuery.value = ''
  selectedLanguage.value = ''
  selectedCategory.value = ''
  selectedTags.value = []
  sortBy.value = 'createdAt'
  emitFilterChange()
}

const hasActiveFilters = computed(() => {
  return searchQuery.value || 
         selectedLanguage.value || 
         selectedCategory.value || 
         selectedTags.value.length > 0
})

const activeFiltersText = computed(() => {
  const filters = []
  if (searchQuery.value) filters.push(`搜索: "${searchQuery.value}"`)
  if (selectedLanguage.value) filters.push(`语言: ${selectedLanguage.value}`)
  if (selectedCategory.value) filters.push(`分类: ${selectedCategory.value}`)
  if (selectedTags.value.length > 0) filters.push(`标签: ${selectedTags.value.join(', ')}`)
  return filters.join(', ')
})

// 监听props变化，更新本地状态
watch(() => props.languages, (newLanguages) => {
  if (selectedLanguage.value && !newLanguages.find(l => l.name === selectedLanguage.value)) {
    selectedLanguage.value = ''
  }
}, { deep: true })

watch(() => props.categories, (newCategories) => {
  if (selectedCategory.value && !newCategories.find(c => c.name === selectedCategory.value)) {
    selectedCategory.value = ''
  }
}, { deep: true })

watch(() => props.tags, (newTags) => {
  selectedTags.value = selectedTags.value.filter(tag => 
    newTags.find(t => t.name === tag)
  )
}, { deep: true })
</script> 