/**
 * 可视化分析工具 直观了解项目打包后的体积构成、优化代码分割和依赖管理
 */
import visualizer from 'rollup-plugin-visualizer'
import { isReportMode } from '../../utils'

export function configVisualizerConfig() {
  if (isReportMode()) {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html', // 输出文件名
      open: true, // 完成后自动在浏览器打开报告
      template: 'treemap', // 图表类型（sunburst、treemap、network 等）
      gzipSize: true, // 显示 gzip 压缩后的体积
      brotliSize: true, // 显示 brotli 压缩后的体积
    })
  }
  return []
}
