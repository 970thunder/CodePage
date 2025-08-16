<template>
    <div class="min-h-screen bg-base-100">
        <!-- 顶部导航栏 -->
        <div class="navbar bg-base-200 shadow-lg">
            <div class="navbar-start">
                <a class="btn btn-ghost text-xl">代码片段管理</a>
            </div>
            <div class="navbar-end">
                <button @click="showCreateModal = true" class="btn btn-primary mr-2">创建代码片段</button>
                <ThemeToggle />
            </div>
        </div>

        <!-- 主要内容 -->
        <div class="container mx-auto px-4 py-8">
            <!-- 登录状态显示 -->
            <div v-if="loginStatus" class="alert alert-info mb-4">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>{{ loginStatus }}</span>
            </div>

            <!-- 搜索和筛选 -->
            <SearchFilter :languages="languages" :categories="categories" :tags="tags"
                @filter-change="handleFilterChange" />

            <!-- 代码片段列表 -->
            <div v-if="loading" class="flex justify-center items-center py-12">
                <span class="loading loading-spinner loading-lg"></span>
                <span class="ml-4">加载中...</span>
            </div>

            <div v-else-if="!snippets || snippets.length === 0" class="text-center py-12">
                <h3 class="text-lg font-semibold mb-2">暂无代码片段</h3>
                <p class="text-base-content/70 mb-4">开始创建您的第一个代码片段吧！</p>
                <button @click="showCreateModal = true" class="btn btn-primary">
                    创建代码片段
                </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <SnippetCard v-for="snippet in snippets" :key="snippet._id" :snippet="snippet" @view="viewSnippet"
                    @edit="editSnippet" @tag-click="handleTagClick" />
            </div>
        </div>

        <!-- 创建代码片段模态框 -->
        <div v-if="showCreateModal" class="modal modal-open">
            <div class="modal-box w-11/12 max-w-4xl">
                <h3 class="font-bold text-lg mb-4">创建代码片段</h3>
                <form @submit.prevent="createSnippet">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div class="form-control">
                            <label class="label">
                                <span class="label-text">标题 *</span>
                            </label>
                            <input v-model="newSnippet.title" type="text" class="input input-bordered" required />
                        </div>

                        <LanguageSelector v-model="newSnippet.language" />
                    </div>

                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">描述</span>
                        </label>
                        <textarea v-model="newSnippet.description" class="textarea textarea-bordered h-20"
                            placeholder="代码片段的描述..."></textarea>
                    </div>

                    <div class="form-control mb-4">
                        <label class="label">
                            <span class="label-text">代码内容 *</span>
                        </label>
                        <textarea v-model="newSnippet.code" class="textarea textarea-bordered font-mono h-64"
                            placeholder="输入您的代码..." required></textarea>
                    </div>

                    <div class="modal-action">
                        <button type="button" @click="showCreateModal = false" class="btn">
                            取消
                        </button>
                        <button type="submit" class="btn btn-primary" :disabled="creating">
                            {{ creating ? '创建中...' : '创建' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { autoLogin } from '../utils/cloudbase.js'
import snippetService from '../utils/snippetService.js'
import SnippetCard from '../components/SnippetCard.vue'
import SearchFilter from '../components/SearchFilter.vue'
import LanguageSelector from '../components/LanguageSelector.vue'
import ThemeToggle from '../components/ThemeToggle.vue'

// 响应式数据
const snippets = ref([])
const languages = ref([])
const categories = ref([])
const tags = ref([])
const loading = ref(false)
const creating = ref(false)
const loginStatus = ref('')

// 模态框
const showCreateModal = ref(false)

// 新代码片段数据
const newSnippet = ref({
    title: '',
    description: '',
    code: '',
    language: ''
})

// 方法
const loadSnippets = async () => {
    loading.value = true
    try {
        const result = await snippetService.getSnippets()
        if (result.success) {
            snippets.value = result.data || []
        } else {
            console.error('加载代码片段失败:', result.error)
            snippets.value = []
        }
    } catch (error) {
        console.error('加载代码片段失败:', error)
        snippets.value = []
    } finally {
        loading.value = false
    }
}

const loadMetadata = async () => {
    try {
        const [languagesResult, categoriesResult, tagsResult] = await Promise.all([
            snippetService.getAllLanguages(),
            snippetService.getAllCategories(),
            snippetService.getAllTags()
        ])

        if (languagesResult.success) languages.value = languagesResult.data || []
        if (categoriesResult.success) categories.value = categoriesResult.data || []
        if (tagsResult.success) tags.value = tagsResult.data || []
    } catch (error) {
        console.error('加载元数据失败:', error)
        languages.value = []
        categories.value = []
        tags.value = []
    }
}

const handleFilterChange = (filters) => {
    console.log('筛选条件:', filters)
    loadSnippets()
}

const createSnippet = async () => {
    creating.value = true
    try {
        const snippetData = {
            title: newSnippet.value.title,
            description: newSnippet.value.description,
            code: newSnippet.value.code,
            language: newSnippet.value.language,
            category: 'general',
            tags: []
        }

        const result = await snippetService.createSnippet(snippetData)
        if (result.success) {
            showCreateModal.value = false
            resetNewSnippet()
            loadSnippets()
        } else {
            console.error('创建代码片段失败:', result.error)
        }
    } catch (error) {
        console.error('创建代码片段失败:', error)
    } finally {
        creating.value = false
    }
}

const resetNewSnippet = () => {
    newSnippet.value = {
        title: '',
        description: '',
        code: '',
        language: ''
    }
}

const viewSnippet = (snippet) => {
    console.log('查看代码片段:', snippet)
}

const editSnippet = (snippet) => {
    console.log('编辑代码片段:', snippet)
}

const handleTagClick = (tag) => {
    console.log('点击标签:', tag)
}

// 生命周期
onMounted(async () => {
    try {
        // 自动进行匿名登录
        loginStatus.value = '正在登录...'
        const loginResult = await autoLogin()

        if (loginResult.success) {
            loginStatus.value = `已登录 (${loginResult.loginType || '匿名用户'})`
            // 加载数据
            await Promise.all([loadSnippets(), loadMetadata()])
        } else {
            loginStatus.value = '登录失败，请刷新页面重试'
            console.error('登录失败:', loginResult.error)
        }
    } catch (error) {
        console.error('初始化失败:', error)
        loginStatus.value = '登录失败，请检查网络连接'
    }
})
</script>