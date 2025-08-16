<template>
    <div class="form-control">
        <label class="label">
            <span class="label-text">编程语言 *</span>
        </label>
        <div class="relative">
            <input v-model="searchQuery" type="text" class="input input-bordered w-full pr-10" placeholder="搜索编程语言..."
                @focus="showDropdown = true" @blur="handleBlur" @input="handleSearch" required />
            <div class="absolute right-3 top-1/2 transform -translate-y-1/2">
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
            </div>

            <!-- 下拉选项 -->
            <div v-if="showDropdown && filteredLanguages.length > 0"
                class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                <div v-for="lang in filteredLanguages" :key="lang.value"
                    class="px-4 py-2 hover:bg-base-200 cursor-pointer flex items-center justify-between"
                    @mousedown="selectLanguage(lang)">
                    <span>{{ lang.label }}</span>
                    <span class="text-xs text-base-content/60">{{ lang.category }}</span>
                </div>
            </div>

            <!-- 无搜索结果 -->
            <div v-if="showDropdown && searchQuery && filteredLanguages.length === 0"
                class="absolute z-50 w-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg">
                <div class="px-4 py-2 text-base-content/60">
                    未找到匹配的语言
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const props = defineProps({
    modelValue: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const showDropdown = ref(false)
const selectedLanguage = ref(null)

// 编程语言列表 - 只包含实际支持的语言
const languages = [
    // 前端语言
    { value: 'javascript', label: 'JavaScript', category: '前端' },
    { value: 'typescript', label: 'TypeScript', category: '前端' },
    { value: 'html', label: 'HTML', category: '前端' },
    { value: 'css', label: 'CSS', category: '前端' },
    { value: 'scss', label: 'SCSS', category: '前端' },
    { value: 'less', label: 'Less', category: '前端' },
    { value: 'jsx', label: 'JSX', category: '前端' },
    { value: 'tsx', label: 'TSX', category: '前端' },
    { value: 'vue', label: 'Vue', category: '前端' },

    // 后端语言
    { value: 'python', label: 'Python', category: '后端' },
    { value: 'java', label: 'Java', category: '后端' },
    { value: 'c', label: 'C', category: '后端' },
    { value: 'cpp', label: 'C++', category: '后端' },
    { value: 'csharp', label: 'C#', category: '后端' },
    { value: 'php', label: 'PHP', category: '后端' },
    { value: 'ruby', label: 'Ruby', category: '后端' },
    { value: 'go', label: 'Go', category: '后端' },
    { value: 'rust', label: 'Rust', category: '后端' },
    { value: 'swift', label: 'Swift', category: '后端' },
    { value: 'kotlin', label: 'Kotlin', category: '后端' },
    { value: 'scala', label: 'Scala', category: '后端' },
    { value: 'dart', label: 'Dart', category: '后端' },
    { value: 'elixir', label: 'Elixir', category: '后端' },
    { value: 'clojure', label: 'Clojure', category: '后端' },
    { value: 'haskell', label: 'Haskell', category: '后端' },
    { value: 'fsharp', label: 'F#', category: '后端' },
    { value: 'lua', label: 'Lua', category: '后端' },
    { value: 'perl', label: 'Perl', category: '后端' },
    { value: 'r', label: 'R', category: '后端' },
    { value: 'matlab', label: 'MATLAB', category: '后端' },
    { value: 'julia', label: 'Julia', category: '后端' },
    { value: 'crystal', label: 'Crystal', category: '后端' },
    { value: 'nim', label: 'Nim', category: '后端' },
    { value: 'zig', label: 'Zig', category: '后端' },
    { value: 'v', label: 'V', category: '后端' },

    // 数据库和查询语言
    { value: 'sql', label: 'SQL', category: '数据库' },
    { value: 'mongodb', label: 'MongoDB', category: '数据库' },
    { value: 'graphql', label: 'GraphQL', category: '数据库' },
    { value: 'sparql', label: 'SPARQL', category: '数据库' },

    // 配置和标记语言
    { value: 'json', label: 'JSON', category: '配置' },
    { value: 'yaml', label: 'YAML', category: '配置' },
    { value: 'markdown', label: 'Markdown', category: '配置' },

    // 脚本语言
    { value: 'bash', label: 'Bash', category: '脚本' },
    { value: 'powershell', label: 'PowerShell', category: '脚本' },
    { value: 'batch', label: 'Batch', category: '脚本' },

    // 其他
    { value: 'dockerfile', label: 'Dockerfile', category: '其他' },
    { value: 'makefile', label: 'Makefile', category: '其他' },
    { value: 'git', label: 'Git', category: '其他' },
    { value: 'diff', label: 'Diff', category: '其他' }
]

// 过滤语言列表
const filteredLanguages = computed(() => {
    if (!searchQuery.value) {
        return languages.slice(0, 10) // 默认显示前10个
    }

    const query = searchQuery.value.toLowerCase()
    return languages.filter(lang =>
        lang.label.toLowerCase().includes(query) ||
        lang.value.toLowerCase().includes(query) ||
        lang.category.toLowerCase().includes(query)
    )
})

// 处理搜索
const handleSearch = () => {
    showDropdown.value = true
}

// 选择语言
const selectLanguage = (lang) => {
    selectedLanguage.value = lang
    searchQuery.value = lang.label
    emit('update:modelValue', lang.value)
    showDropdown.value = false
}

// 处理失焦
const handleBlur = () => {
    setTimeout(() => {
        showDropdown.value = false
    }, 200)
}

// 初始化
onMounted(() => {
    if (props.modelValue) {
        const lang = languages.find(l => l.value === props.modelValue)
        if (lang) {
            selectedLanguage.value = lang
            searchQuery.value = lang.label
        }
    }
})
</script>

<style scoped>
/* 自定义滚动条 */
.overflow-y-auto::-webkit-scrollbar {
    width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
    background: var(--bg-secondary);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
    background: var(--text-secondary);
    border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
    background: var(--text-primary);
}
</style>