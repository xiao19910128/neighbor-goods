import { defineConfig } from 'vite'
import uni from '@dcloudio/vite-plugin-uni'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [uni()],
  // 开发服务器配置（代理核心）
  server: {
    // 开启代理
    proxy: {
      // 匹配以 /api 开头的请求
      // 保留其他接口的代理（比如 /api/user、/api/goods 等）
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        // 排除图片 URL 的代理（以 /api/upload/image 开头的请求正常代理，返回的图片 URL 直接访问）
        bypass: function (req, res, options) {
          // 如果是图片上传接口，正常代理；如果是图片 URL，直接放行
          if (req.url.startsWith('/api/upload/image')) {
            return; // 正常代理到后端
          }
        }
      }
    }
  }
})
