import { app } from './cloudbase.js'

const db = app.database()

/**
 * 确保集合存在，如果不存在则创建
 */
export const ensureCollection = async (collectionName) => {
    try {
        // 尝试获取集合信息，如果不存在会抛出错误
        await db.collection(collectionName).limit(1).get()
        console.log(`集合 ${collectionName} 已存在`)
        return true
    } catch (error) {
        if (error.code === 'DATABASE_COLLECTION_NOT_EXIST') {
            console.log(`集合 ${collectionName} 不存在，正在创建...`)
            try {
                // 通过添加一条测试数据来创建集合
                await db.collection(collectionName).add({
                    _test: true,
                    createdAt: new Date()
                })
                console.log(`集合 ${collectionName} 创建成功`)

                // 删除测试数据
                await db.collection(collectionName).where({ _test: true }).remove()
                return true
            } catch (createError) {
                console.error(`创建集合 ${collectionName} 失败:`, createError)
                return false
            }
        } else {
            console.error(`检查集合 ${collectionName} 时出错:`, error)
            return false
        }
    }
}

/**
 * 初始化所有必需的集合
 */
export const initDatabase = async () => {
    console.log('开始初始化数据库...')

    const collections = ['code_snippets']
    const results = []

    for (const collectionName of collections) {
        const result = await ensureCollection(collectionName)
        results.push({ collection: collectionName, success: result })
    }

    console.log('数据库初始化完成:', results)
    return results
}

/**
 * 获取集合实例
 */
export const getCollection = async (collectionName) => {
    const exists = await ensureCollection(collectionName)
    if (!exists) {
        throw new Error(`集合 ${collectionName} 创建失败`)
    }
    return db.collection(collectionName)
} 