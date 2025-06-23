/**
 * 为 ​​Vite​​ 项目提供本地 mock 数据支持的插件，能够快速搭建前后端分离的模拟接口环境
 */
import { viteMockServe } from 'vite-plugin-mock'

export function configMockPlugin(isBuild: boolean) {
  return viteMockServe({
    ignore: /^\_/,
    mockPath: 'mock', // mock文件存放目录
    enable: !isBuild, // 开发环境启用，生产环境不启用
  })
}
