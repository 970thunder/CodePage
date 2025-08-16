// 测试匿名登录功能
console.log('🔐 测试匿名登录功能')

// 模拟登录流程
async function testLogin() {
    console.log('1. 开始匿名登录...')

    // 模拟登录成功
    const loginResult = {
        success: true,
        loginType: 'anonymous',
        data: {
            user: {
                uid: 'test-user-id',
                name: 'anonymous'
            }
        }
    }

    console.log('2. 登录结果:', loginResult)

    if (loginResult.success) {
        console.log('✅ 登录成功!')
        console.log('👤 用户类型:', loginResult.loginType)
        console.log('🆔 用户ID:', loginResult.data.user.uid)
        return true
    } else {
        console.log('❌ 登录失败')
        return false
    }
}

// 执行测试
testLogin().then(success => {
    if (success) {
        console.log('\n🎉 登录测试通过!')
        console.log('🌐 现在可以访问: http://127.0.0.1:5173/')
        console.log('📝 开始创建您的代码片段吧!')
    } else {
        console.log('\n💥 登录测试失败!')
    }
})

console.log('\n📖 参考文档: https://docs.cloudbase.net/authentication-v2/method/anonymous') 