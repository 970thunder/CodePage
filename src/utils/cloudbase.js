import cloudbase from '@cloudbase/js-sdk';

// 云开发环境ID，使用时请替换为您的环境ID
const ENV_ID = 'qqq-6glhju5q16c9e855';

// 检查环境ID是否已配置
export const isValidEnvId = ENV_ID && ENV_ID !== 'your-env-id';

// 全局变量，确保只有一个实例
let appInstance = null;
let authInstance = null;

/**
 * 初始化云开发实例
 * @param {Object} config - 初始化配置
 * @param {string} config.env - 环境ID，默认使用ENV_ID
 * @param {number} config.timeout - 超时时间，默认15000ms
 * @returns {Object} 云开发实例
 */
export const init = (config = {}) => {
  if (appInstance) {
    return appInstance;
  }

  const appConfig = {
    env: config.env || ENV_ID,
    timeout: config.timeout || 15000,
  };

  appInstance = cloudbase.init(appConfig);
  return appInstance;
};

/**
 * 获取默认的云开发实例
 */
export const app = init();

/**
 * 获取认证实例
 */
export const getAuth = () => {
  if (!authInstance) {
    authInstance = app.auth();
  }
  return authInstance;
};

/**
 * 检查环境配置是否有效
 */
export const checkEnvironment = () => {
  if (!isValidEnvId) {
    const message = '❌ 云开发环境ID未配置\n\n请按以下步骤配置：\n1. 打开 src/utils/cloudbase.js 文件\n2. 将 ENV_ID 变量的值替换为您的云开发环境ID\n3. 保存文件并刷新页面\n\n获取环境ID：https://console.cloud.tencent.com/tcb';
    console.error(message);
    return false;
  }
  return true;
};

/**
 * 执行匿名登录
 * @returns {Promise} 登录结果
 */
export const performAnonymousLogin = async () => {
  const auth = getAuth();

  try {
    console.log('开始匿名登录...');
    const result = await auth.signInAnonymously();
    console.log('匿名登录成功:', result);
    return { success: true, data: result };
  } catch (error) {
    console.error('匿名登录失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 确保用户已登录 - 简化版本
 * @returns {Promise} 登录状态
 */
export const ensureLogin = async () => {
  // 检查环境配置
  if (!checkEnvironment()) {
    throw new Error('环境ID未配置');
  }

  try {
    // 直接进行匿名登录
    const result = await performAnonymousLogin();
    if (result.success) {
      console.log('登录成功');
      return { isLoggedIn: true, loginType: 'anonymous' };
    } else {
      throw new Error(result.error);
    }
  } catch (error) {
    console.error('登录失败:', error);
    throw error;
  }
};

/**
 * 自动登录（在页面加载时调用）
 */
export const autoLogin = async () => {
  try {
    const result = await performAnonymousLogin();
    if (result.success) {
      console.log('自动登录完成');
      return { success: true, loginType: 'anonymous' };
    } else {
      console.error('自动登录失败:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('自动登录失败:', error);
    return { success: false, error: error.message };
  }
};

/**
 * 退出登录（注意：匿名登录无法退出）
 * @returns {Promise}
 */
export const logout = async () => {
  const auth = getAuth();

  try {
    await auth.signOut();
    return { success: true, message: '已成功退出登录' };
  } catch (error) {
    console.error('退出登录失败:', error);
    throw error;
  }
};

// 默认导出
export default {
  init,
  app,
  getAuth,
  ensureLogin,
  autoLogin,
  performAnonymousLogin,
  logout,
  checkEnvironment,
  isValidEnvId
}; 