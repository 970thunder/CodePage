<template>
    <div class="code-highlight">
        <pre
            class="language-{{ language }}"><code ref="codeElement" class="language-{{ language }}">{{ code }}</code></pre>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'

// 基础语言 - 按依赖顺序导入
import 'prismjs/components/prism-markup'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-c'
import 'prismjs/components/prism-cpp'
import 'prismjs/components/prism-csharp'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-ruby'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-scss'
import 'prismjs/components/prism-less'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-yaml'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-bash'

// 扩展语言支持
import 'prismjs/components/prism-swift'
import 'prismjs/components/prism-kotlin'
import 'prismjs/components/prism-scala'
import 'prismjs/components/prism-dart'
import 'prismjs/components/prism-elixir'
import 'prismjs/components/prism-clojure'
import 'prismjs/components/prism-haskell'
import 'prismjs/components/prism-fsharp'
import 'prismjs/components/prism-lua'
import 'prismjs/components/prism-perl'
import 'prismjs/components/prism-r'
import 'prismjs/components/prism-matlab'
import 'prismjs/components/prism-julia'
import 'prismjs/components/prism-crystal'
import 'prismjs/components/prism-nim'
import 'prismjs/components/prism-zig'
import 'prismjs/components/prism-v'
import 'prismjs/components/prism-mongodb'
import 'prismjs/components/prism-graphql'
import 'prismjs/components/prism-powershell'
import 'prismjs/components/prism-batch'
import 'prismjs/components/prism-docker'
import 'prismjs/components/prism-makefile'
import 'prismjs/components/prism-git'
import 'prismjs/components/prism-diff'

const props = defineProps({
    code: {
        type: String,
        required: true
    },
    language: {
        type: String,
        default: 'javascript'
    }
})

const codeElement = ref(null)

const highlightCode = () => {
    if (codeElement.value) {
        Prism.highlightElement(codeElement.value)
    }
}

onMounted(() => {
    highlightCode()
})

watch(() => props.code, () => {
    highlightCode()
})

watch(() => props.language, () => {
    highlightCode()
})
</script>

<style scoped>
.code-highlight {
    position: relative;
    border-radius: 0.5rem;
    overflow: hidden;
}

.code-highlight pre {
    margin: 0;
    padding: 1rem;
    background: var(--code-bg, #1e1e1e);
    color: var(--code-text, #d4d4d4);
    font-family: 'Fira Code', 'Monaco', 'Consolas', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
    overflow-x: auto;
}

.code-highlight code {
    background: none;
    padding: 0;
    border-radius: 0;
    font-family: inherit;
}

/* 暗黑模式适配 */
:root {
    --code-bg: #1e1e1e;
    --code-text: #d4d4d4;
}

[data-theme="light"] {
    --code-bg: #f8f9fa;
    --code-text: #212529;
}

[data-theme="dark"] {
    --code-bg: #1e1e1e;
    --code-text: #d4d4d4;
}
</style>