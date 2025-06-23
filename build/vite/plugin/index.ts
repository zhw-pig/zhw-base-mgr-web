// package.json不要显示写type=module，否则会导致PkgConfig等插件需要额外default处理
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx' // 用于在 Vue 项目中支持 ​​JSX 语法​​ 的转换和编译
import { presetTypography } from 'unocss' // tailwindcss和unocss 原子化css
import UnoCSS from 'unocss/vite'
import { PluginOption } from 'vite'
//[issues/555]开发环境，vscode断点调试，文件或行数对不上
import vueSetupExtend from 'vite-plugin-vue-setup-extend-plus' // 用于增强 <script setup> 语法的开发体验
import { configCompressPlugin } from './compress'
import { configHtmlPlugin } from './html'
import { configSvgIconsPlugin } from './svgSprite'
import { configThemePlugin } from './theme'
import { configVisualizerConfig } from './visualizer'
// 启用预编译加载插件，解决vite首次打开界面加载慢问题
import OptimizationPersist from 'vite-plugin-optimize-persist'
import PkgConfig from 'vite-plugin-package-config'
import vueDevTools from 'vite-plugin-vue-devtools'

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean) {
  const { VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv
  console.log(vueSetupExtend, 'vueSetupExtend')

  const vitePlugins: (PluginOption | PluginOption[])[] = [
    // have to
    vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => /^micro-app/.test(tag),
        },
      },
    }),
    vueDevTools(),
    vueJsx(),
    vueSetupExtend(),
  ]

  vitePlugins.push(UnoCSS({ presets: [presetTypography()] }))

  // vite-plugin-html
  vitePlugins.push(configHtmlPlugin(viteEnv, isBuild))

  // vite-plugin-svg-icons
  vitePlugins.push(configSvgIconsPlugin(isBuild))

  // rollup-plugin-visualizer
  vitePlugins.push(configVisualizerConfig())

  // vite-plugin-theme
  vitePlugins.push(configThemePlugin(isBuild))

  // The following plugins only work in the production environment
  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE),
    )
  }

  // vite-plugin-theme【预编译加载插件，解决vite首次打开界面加载慢问题】
  console.log(PkgConfig, 'PkgConfig')

  vitePlugins.push(PkgConfig())
  vitePlugins.push(OptimizationPersist())
  return vitePlugins
}
