import { app } from './cloudbase.js'

const db = app.database()
const collection = db.collection('snippets')

/**
 * 代码片段服务类
 */
class SnippetService {
    /**
     * 创建新的代码片段
     * @param {Object} snippetData - 代码片段数据
     * @returns {Promise} 创建结果
     */
    async createSnippet(snippetData) {
        try {
            const data = {
                ...snippetData,
                createdAt: new Date(),
                updatedAt: new Date(),
                views: 0,
                likes: 0,
                isPublic: true
            }

            const result = await collection.add(data)
            return { success: true, data: result }
        } catch (error) {
            console.error('创建代码片段失败:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * 获取代码片段列表
     * @param {Object} options - 查询选项
     * @returns {Promise} 查询结果
     */
    async getSnippets(options = {}) {
        try {
            const {
                page = 1,
                pageSize = 20,
                language = null,
                category = null,
                tags = null,
                search = null,
                sortBy = 'createdAt',
                sortOrder = 'desc'
            } = options

            let query = collection

            // 添加筛选条件
            if (language) {
                query = query.where({ language })
            }
            if (category) {
                query = query.where({ category })
            }
            if (tags && tags.length > 0) {
                query = query.where({
                    tags: db.command.in(tags)
                })
            }
            if (search) {
                query = query.where({
                    title: db.command.regex({
                        regexp: search,
                        options: 'i'
                    })
                })
            }

            // 排序
            query = query.orderBy(sortBy, sortOrder)

            // 分页
            const skip = (page - 1) * pageSize
            query = query.skip(skip).limit(pageSize)

            const result = await query.get()
            return { success: true, data: result.data || [] }
        } catch (error) {
            console.error('获取代码片段失败:', error)
            return { success: false, error: error.message, data: [] }
        }
    }

    /**
     * 根据ID获取单个代码片段
     * @param {string} id - 代码片段ID
     * @returns {Promise} 查询结果
     */
    async getSnippetById(id) {
        try {
            const result = await collection.doc(id).get()
            if (result.data && result.data.length > 0) {
                // 增加浏览次数
                await this.incrementViews(id)
                return { success: true, data: result.data[0] }
            }
            return { success: false, error: '代码片段不存在' }
        } catch (error) {
            console.error('获取代码片段失败:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * 更新代码片段
     * @param {string} id - 代码片段ID
     * @param {Object} updateData - 更新数据
     * @returns {Promise} 更新结果
     */
    async updateSnippet(id, updateData) {
        try {
            const data = {
                ...updateData,
                updatedAt: new Date()
            }

            const result = await collection.doc(id).update(data)
            return { success: true, data: result }
        } catch (error) {
            console.error('更新代码片段失败:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * 删除代码片段
     * @param {string} id - 代码片段ID
     * @returns {Promise} 删除结果
     */
    async deleteSnippet(id) {
        try {
            const result = await collection.doc(id).remove()
            return { success: true, data: result }
        } catch (error) {
            console.error('删除代码片段失败:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * 增加浏览次数
     * @param {string} id - 代码片段ID
     * @returns {Promise} 更新结果
     */
    async incrementViews(id) {
        try {
            await collection.doc(id).update({
                views: db.command.inc(1)
            })
        } catch (error) {
            console.error('增加浏览次数失败:', error)
        }
    }

    /**
     * 增加点赞数
     * @param {string} id - 代码片段ID
     * @returns {Promise} 更新结果
     */
    async incrementLikes(id) {
        try {
            const result = await collection.doc(id).update({
                likes: db.command.inc(1)
            })
            return { success: true, data: result }
        } catch (error) {
            console.error('增加点赞数失败:', error)
            return { success: false, error: error.message }
        }
    }

    /**
     * 获取所有标签
     * @returns {Promise} 标签列表
     */
    async getAllTags() {
        try {
            const result = await collection.aggregate()
                .group({
                    _id: '$tags',
                    count: db.command.aggregate.sum(1)
                })
                .end()

            const tags = []
            if (result.list && Array.isArray(result.list)) {
                result.list.forEach(item => {
                    if (item._id && Array.isArray(item._id)) {
                        item._id.forEach(tag => {
                            if (!tags.find(t => t.name === tag)) {
                                tags.push({ name: tag, count: item.count })
                            }
                        })
                    }
                })
            }

            return { success: true, data: tags.sort((a, b) => b.count - a.count) }
        } catch (error) {
            console.error('获取标签失败:', error)
            return { success: true, data: [] }
        }
    }

    /**
     * 获取所有分类
     * @returns {Promise} 分类列表
     */
    async getAllCategories() {
        try {
            const result = await collection.aggregate()
                .group({
                    _id: '$category',
                    count: db.command.aggregate.sum(1)
                })
                .end()

            let categories = []
            if (result.list && Array.isArray(result.list)) {
                categories = result.list
                    .filter(item => item._id)
                    .map(item => ({
                        name: item._id,
                        count: item.count
                    }))
                    .sort((a, b) => b.count - a.count)
            }

            return { success: true, data: categories }
        } catch (error) {
            console.error('获取分类失败:', error)
            return { success: true, data: [] }
        }
    }

    /**
     * 获取所有编程语言
     * @returns {Promise} 语言列表
     */
    async getAllLanguages() {
        try {
            const result = await collection.aggregate()
                .group({
                    _id: '$language',
                    count: db.command.aggregate.sum(1)
                })
                .end()

            let languages = []
            if (result.list && Array.isArray(result.list)) {
                languages = result.list
                    .filter(item => item._id)
                    .map(item => ({
                        name: item._id,
                        count: item.count
                    }))
                    .sort((a, b) => b.count - a.count)
            }

            return { success: true, data: languages }
        } catch (error) {
            console.error('获取语言失败:', error)
            return { success: true, data: [] }
        }
    }

    /**
     * 搜索代码片段
     * @param {string} keyword - 搜索关键词
     * @param {Object} options - 搜索选项
     * @returns {Promise} 搜索结果
     */
    async searchSnippets(keyword, options = {}) {
        try {
            const {
                page = 1,
                pageSize = 20,
                language = null,
                category = null,
                tags = null
            } = options

            let query = collection.where({
                $or: [
                    {
                        title: db.command.regex({
                            regexp: keyword,
                            options: 'i'
                        })
                    },
                    {
                        description: db.command.regex({
                            regexp: keyword,
                            options: 'i'
                        })
                    },
                    {
                        tags: db.command.in([keyword])
                    }
                ]
            })

            // 添加筛选条件
            if (language) {
                query = query.where({ language })
            }
            if (category) {
                query = query.where({ category })
            }
            if (tags && tags.length > 0) {
                query = query.where({
                    tags: db.command.in(tags)
                })
            }

            // 排序和分页
            const skip = (page - 1) * pageSize
            const result = await query
                .orderBy('createdAt', 'desc')
                .skip(skip)
                .limit(pageSize)
                .get()

            return { success: true, data: result.data || [] }
        } catch (error) {
            console.error('搜索代码片段失败:', error)
            return { success: false, error: error.message, data: [] }
        }
    }
}

export default new SnippetService() 