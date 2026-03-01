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
      '/api': {
        // 目标服务器地址（你的 Node.js 接口服务）
        target: 'http://localhost:3000',
        // 是否开启跨域（必须设置为 true）
        changeOrigin: true,
        // 可选：是否重写路径（如果后端接口本身就带 /api，这里不需要重写）
        // 比如前端请求 /api/goods/query，转发后就是 http://localhost:3000/api/goods/query
        rewrite: (path) => path, 
        // 可选：如果是 https 接口，需要配置 secure: false
        // secure: false
      }
    }
  }
})
