/**
 *  用于高效管理 ​​SVG 图标​​，通过预编译和动态加载机制优化图标使用体验
 */

import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export function configSvgIconsPlugin(isBuild: boolean) {
  const svgIconsPlugin = createSvgIconsPlugin({
    // 指定图标目录（绝对路径）
    iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
    // 自定义插入位置
    svgoOptions: isBuild,
    // 指定 symbolId 格式
    symbolId: 'icon-[dir]-[name]',
  })
  return svgIconsPlugin
}
