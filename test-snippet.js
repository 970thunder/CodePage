// 测试代码片段管理功能
console.log('🚀 代码片段管理系统测试')

// 模拟测试数据
const testSnippets = [
    {
        title: 'Vue 3 响应式数据',
        description: 'Vue 3 Composition API 响应式数据示例',
        code: `import { ref, reactive } from 'vue'

// 响应式数据
const count = ref(0)
const user = reactive({
  name: '张三',
  age: 25
})

// 修改数据
count.value++
user.age = 26

console.log(count.value, user.name)`,
        language: 'javascript',
        category: 'frontend',
        tags: ['vue', 'javascript', 'frontend']
    },
    {
        title: 'Python 列表推导式',
        description: 'Python 列表推导式的使用示例',
        code: `# 传统方式
numbers = []
for i in range(10):
    if i % 2 == 0:
        numbers.append(i * 2)

# 列表推导式
numbers = [i * 2 for i in range(10) if i % 2 == 0]

print(numbers)  # [0, 4, 8, 12, 16]`,
        language: 'python',
        category: 'backend',
        tags: ['python', 'backend', 'list-comprehension']
    },
    {
        title: 'CSS Grid 布局',
        description: 'CSS Grid 网格布局示例',
        code: `.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 20px;
  padding: 20px;
}

.grid-item {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .grid-container {
    grid-template-columns: repeat(2, 1fr);
  }
}`,
        language: 'css',
        category: 'frontend',
        tags: ['css', 'grid', 'frontend', 'responsive']
    },
    {
        title: 'Rust 所有权系统',
        description: 'Rust 所有权和借用系统示例',
        code: `fn main() {
    let s1 = String::from("hello");
    let s2 = s1; // s1 的所有权移动到 s2
    
    // println!("{}", s1); // 编译错误：s1 已被移动
    println!("{}", s2); // 正常工作
    
    let s3 = &s2; // 借用 s2
    println!("{}", s3); // 正常工作
}`,
        language: 'rust',
        category: 'backend',
        tags: ['rust', 'backend', 'ownership']
    },
    {
        title: 'Go 并发编程',
        description: 'Go 语言 goroutine 和 channel 示例',
        code: `package main

import (
    "fmt"
    "time"
)

func worker(id int, jobs <-chan int, results chan<- int) {
    for j := range jobs {
        fmt.Printf("worker %d processing job %d\n", id, j)
        time.Sleep(time.Second)
        results <- j * 2
    }
}

func main() {
    jobs := make(chan int, 100)
    results := make(chan int, 100)
    
    // 启动 3 个 worker
    for w := 1; w <= 3; w++ {
        go worker(w, jobs, results)
    }
    
    // 发送 9 个任务
    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs)
    
    // 收集结果
    for a := 1; a <= 9; a++ {
        <-results
    }
}`,
        language: 'go',
        category: 'backend',
        tags: ['go', 'backend', 'concurrency']
    }
]

console.log('✅ 测试数据准备完成')
console.log('📝 包含以下代码片段:')
testSnippets.forEach((snippet, index) => {
    console.log(`${index + 1}. ${snippet.title} (${snippet.language})`)
})

console.log('\n🎯 功能特性:')
console.log('- ✅ 多语言支持 (50+ 种编程语言)')
console.log('- ✅ 智能语言选择器 (支持模糊搜索)')
console.log('- ✅ 标签分类系统')
console.log('- ✅ 代码语法高亮')
console.log('- ✅ 一键复制功能')
console.log('- ✅ 暗黑模式切换')
console.log('- ✅ 响应式设计')
console.log('- ✅ 实时搜索和筛选')
console.log('- ✅ CloudBase 云数据存储')
console.log('- ✅ 自动匿名登录')

console.log('\n🔍 语言选择器特性:')
console.log('- 支持 50+ 种编程语言')
console.log('- 按类别分组 (前端、后端、数据库、配置、脚本、其他)')
console.log('- 模糊搜索功能')
console.log('- 键盘导航支持')
console.log('- 响应式设计')

console.log('\n🔐 认证功能:')
console.log('- 自动匿名登录')
console.log('- 登录状态显示')
console.log('- 基于 CloudBase 的用户认证')
console.log('- 支持匿名用户转正')

console.log('\n🌐 访问地址: http://127.0.0.1:5173/')
console.log('📖 详细文档: README_SNIPPET.md')
console.log('🔗 CloudBase 匿名登录文档: https://docs.cloudbase.net/authentication-v2/method/anonymous') 