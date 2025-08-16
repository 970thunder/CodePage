# 代码片段管理系统

一个基于Vue 3 + CloudBase的现代化代码片段管理平台，支持多语言、标签分类、实时搜索和暗黑模式。

## 功能特性

### 🎯 核心功能
- **代码片段管理**: 创建、编辑、删除代码片段
- **多语言支持**: 支持50+种编程语言，包括前端、后端、数据库、配置、脚本等
- **智能语言选择器**: 支持模糊搜索的编程语言选择器，按类别分组展示
- **标签分类**: 灵活的标签系统，支持多标签筛选
- **实时搜索**: 基于标题、描述、标签的智能搜索
- **一键复制**: 使用Clipboard.js实现代码秒复制
- **语法高亮**: 使用Prism.js提供代码语法高亮
- **自动匿名登录**: 页面加载时自动进行匿名登录，无需用户操作

### 🎨 用户体验
- **暗黑模式**: CSS变量实现的主题切换
- **响应式设计**: 完美适配手机、平板、桌面设备
- **现代化UI**: 基于DaisyUI的优雅界面设计
- **流畅动画**: 平滑的过渡效果和交互反馈

### 🔧 技术特性
- **云数据库**: 基于CloudBase文档型数据库存储
- **实时同步**: 数据实时更新和同步
- **权限控制**: 基于CloudBase的用户认证系统
- **性能优化**: 分页加载和懒加载优化

## 技术栈

- **前端框架**: Vue 3 + Composition API
- **UI组件库**: DaisyUI + Tailwind CSS
- **云服务**: 腾讯云开发 CloudBase
- **代码高亮**: Prism.js
- **复制功能**: Clipboard.js
- **搜索**: Algolia (可选)

## 快速开始

### 1. 环境配置

确保已配置CloudBase环境ID：

```javascript
// src/utils/cloudbase.js
const ENV_ID = 'your-cloudbase-env-id'
```

### 2. 安装依赖

```bash
npm install
```

### 3. 启动开发服务器

```bash
npm run dev
```

### 4. 构建生产版本

```bash
npm run build
```

## 项目结构

```
src/
├── components/           # 组件目录
│   ├── SnippetCard.vue   # 代码片段卡片组件
│   ├── SearchFilter.vue  # 搜索筛选组件
│   ├── CodeHighlight.vue # 代码高亮组件
│   ├── LanguageSelector.vue # 智能语言选择器
│   └── ThemeToggle.vue   # 主题切换组件
├── pages/               # 页面目录
│   └── HomePage.vue     # 主页面
├── utils/               # 工具目录
│   ├── cloudbase.js     # CloudBase配置
│   └── snippetService.js # 数据服务层
└── style.css            # 全局样式
```

## 数据模型

### 代码片段结构

```javascript
{
  _id: "snippet_id",
  title: "代码片段标题",
  description: "描述信息",
  code: "代码内容",
  language: "javascript", // 编程语言
  tags: ["vue", "javascript", "frontend"], // 标签数组
  category: "frontend", // 分类
  author: "user_id",
  createdAt: "2024-01-01T00:00:00.000Z",
  updatedAt: "2024-01-01T00:00:00.000Z",
  views: 0, // 浏览次数
  likes: 0, // 点赞数
  isPublic: true // 是否公开
}
```

## 使用指南

### 自动登录

系统会在页面加载时自动进行匿名登录，无需用户手动操作：

1. 页面加载时自动调用 `auth.signInAnonymously()`
2. 显示登录状态（"已登录 (匿名用户)"）
3. 登录成功后自动加载数据

### 创建代码片段

1. 点击"创建代码片段"按钮
2. 填写标题
3. **使用智能语言选择器选择编程语言**：
   - 支持模糊搜索
   - 按类别分组（前端、后端、数据库、配置、脚本、其他）
   - 支持50+种编程语言
4. 输入代码内容和描述
5. 点击"创建"保存

### 智能语言选择器

- **模糊搜索**: 输入语言名称、类别或关键词进行搜索
- **分类浏览**: 语言按类别分组，便于快速定位
- **键盘导航**: 支持键盘上下键选择
- **响应式设计**: 在移动设备上也能良好工作

### 支持的编程语言

#### 前端语言
- JavaScript, TypeScript, HTML, CSS, SCSS, Less, JSX, TSX, Vue

#### 后端语言
- Python, Java, C, C++, C#, PHP, Ruby, Go, Rust, Swift, Kotlin, Scala, Dart, Elixir, Clojure, Haskell, F#, Lua, Perl, R, MATLAB, Julia, Crystal, Nim, Zig, V

#### 数据库和查询语言
- SQL, MongoDB, GraphQL, SPARQL

#### 配置和标记语言
- JSON, YAML, Markdown

#### 脚本语言
- Bash, PowerShell, Batch

#### 其他
- Dockerfile, Makefile, Git, Diff

### 搜索和筛选

- **实时搜索**: 在搜索框中输入关键词
- **语言筛选**: 选择特定的编程语言
- **标签筛选**: 勾选相关标签
- **分类筛选**: 按分类浏览代码片段

### 代码操作

- **查看详情**: 点击"查看详情"查看完整代码
- **一键复制**: 点击复制按钮快速复制代码
- **编辑**: 点击"编辑"修改代码片段
- **点赞**: 为喜欢的代码片段点赞

### 主题切换

点击右上角的主题切换按钮在明暗主题间切换。

## 配置说明

### CloudBase配置

1. 在腾讯云开发控制台创建环境
2. 获取环境ID并配置到`src/utils/cloudbase.js`
3. 创建`snippets`集合
4. 配置数据库权限规则

### 匿名登录配置

根据[CloudBase匿名登录文档](https://docs.cloudbase.net/authentication-v2/method/anonymous)：

1. 前往云开发/身份认证
2. 在登录方式列表中，选择**匿名登录**方式，点击开启
3. 系统会自动进行匿名登录，无需用户手动操作

### 搜索配置 (可选)

如需使用Algolia搜索，请配置以下环境变量：

```javascript
// .env
VITE_ALGOLIA_APP_ID=your_app_id
VITE_ALGOLIA_SEARCH_KEY=your_search_key
VITE_ALGOLIA_INDEX_NAME=snippets
```

## 部署

### CloudBase部署

```bash
# 安装CloudBase CLI
npm install -g @cloudbase/cli

# 登录
tcb login

# 部署
tcb deploy
```

### 静态部署

```bash
# 构建
npm run build

# 部署到任意静态服务器
```

## 开发指南

### 添加新语言支持

1. 在`LanguageSelector.vue`中添加新的语言选项
2. 在`CodeHighlight.vue`中导入对应的Prism语言包
3. 更新语言分类和显示名称

### 自定义主题

修改`src/style.css`中的CSS变量来自定义主题：

```css
:root {
  --bg-primary: #ffffff;
  --bg-secondary: #f8f9fa;
  --text-primary: #1a1a1a;
  /* 更多变量... */
}
```

### 扩展功能

- **用户系统**: 添加用户注册、登录功能
- **收藏功能**: 实现代码片段收藏
- **分享功能**: 支持代码片段分享
- **评论系统**: 添加代码片段评论
- **版本控制**: 实现代码片段版本管理
- **导入导出**: 支持代码片段批量导入导出

## 故障排除

### 登录问题

如果遇到登录问题，请检查：

1. CloudBase环境ID是否正确配置
2. 是否已开启匿名登录功能
3. 网络连接是否正常
4. 浏览器控制台是否有错误信息

### 常见错误

- **"登录失败，请刷新页面重试"**: 检查CloudBase配置和网络连接
- **"环境ID未配置"**: 在`src/utils/cloudbase.js`中配置正确的环境ID

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License

## 支持

如有问题或建议，请提交 Issue 或联系开发团队。

## 参考文档

- [CloudBase 匿名登录文档](https://docs.cloudbase.net/authentication-v2/method/anonymous)
- [CloudBase 数据库文档](https://docs.cloudbase.net/database/doc-crud)
- [Vue 3 官方文档](https://vuejs.org/)
- [DaisyUI 文档](https://daisyui.com/) 