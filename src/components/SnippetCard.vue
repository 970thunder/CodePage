<template>
  <div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
    <div class="card-body">
      <!-- 标题和语言标识 -->
      <div class="flex justify-between items-start mb-4">
        <h2 class="card-title text-lg">{{ snippet.title }}</h2>
        <div class="badge badge-primary">{{ snippet.language }}</div>
      </div>

      <!-- 描述 -->
      <p v-if="snippet.description" class="text-base-content/70 mb-4 line-clamp-2">
        {{ snippet.description }}
      </p>

      <!-- 代码预览 -->
      <div class="relative mb-4">
        <div class="absolute top-2 right-2 z-10">
          <button 
            @click="copyCode"
            class="btn btn-sm btn-ghost btn-circle"
            :class="{ 'btn-success': copied }"
            :title="copied ? '已复制' : '复制代码'"
          >
            <svg v-if="!copied" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </button>
        </div>
        
        <div class="max-h-48 overflow-hidden rounded-lg">
          <CodeHighlight 
            :code="snippet.code" 
            :language="snippet.language"
            ref="codeHighlight"
          />
        </div>
        
        <div v-if="snippet.code.length > 200" class="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-base-100 to-transparent"></div>
      </div>

      <!-- 标签 -->
      <div v-if="snippet.tags && snippet.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
        <span 
          v-for="tag in snippet.tags" 
          :key="tag"
          class="badge badge-outline badge-sm cursor-pointer hover:badge-primary"
          @click="$emit('tag-click', tag)"
        >
          {{ tag }}
        </span>
      </div>

      <!-- 统计信息 -->
      <div class="flex justify-between items-center text-sm text-base-content/60">
        <div class="flex items-center gap-4">
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            {{ snippet.views || 0 }}
          </span>
          <span class="flex items-center gap-1">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
            </svg>
            {{ snippet.likes || 0 }}
          </span>
        </div>
        
        <div class="text-xs">
          {{ formatDate(snippet.createdAt) }}
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="card-actions justify-end mt-4">
        <button 
          @click="$emit('view', snippet)"
          class="btn btn-primary btn-sm"
        >
          查看详情
        </button>
        <button 
          @click="$emit('edit', snippet)"
          class="btn btn-outline btn-sm"
        >
          编辑
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Clipboard from 'clipboard'
import CodeHighlight from './CodeHighlight.vue'

const props = defineProps({
  snippet: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['view', 'edit', 'tag-click'])

const copied = ref(false)
const codeHighlight = ref(null)

const copyCode = () => {
  const clipboard = new Clipboard('.btn', {
    text: () => props.snippet.code
  })
  
  clipboard.on('success', () => {
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
    clipboard.destroy()
  })
  
  clipboard.on('error', () => {
    console.error('复制失败')
    clipboard.destroy()
  })
  
  clipboard.onClick()
}

const formatDate = (date) => {
  if (!date) return ''
  const d = new Date(date)
  const now = new Date()
  const diff = now - d
  
  if (diff < 24 * 60 * 60 * 1000) {
    return '今天'
  } else if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`
  } else {
    return d.toLocaleDateString()
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style> 