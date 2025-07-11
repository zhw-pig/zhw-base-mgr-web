/**
 * 专为 ​​Vite​​ 构建工具设计的主题管理插件，主要用于实现前端项目的动态主题切换、主题变量编译和样式热更新
 */
import {
  antdDarkThemePlugin,
  mixDarken,
  mixLighten,
  tinycolor,
  viteThemePlugin,
} from '@rys-fe/vite-plugin-theme'
import path from 'path'
import type { PluginOption } from 'vite'
import { generateColors, getThemeColors } from '../../config/themeConfig'
import { generateModifyVars } from '../../generate/generateModifyVars'

export function configThemePlugin(isBuild: boolean): PluginOption[] {
  const colors = generateColors({
    mixDarken,
    mixLighten,
    tinycolor,
  })

  // 抽取出viteThemePlugin插件，下方会根据不同环境设置enforce
  const vite_theme_plugin = viteThemePlugin({
    resolveSelector: (s) => {
      s = s.trim()
      switch (s) {
        case '.ant-steps-item-process .ant-steps-item-icon > .ant-steps-icon':
          return '.ant-steps-item-icon > .ant-steps-icon'
        case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)':
        case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):hover':
        case '.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):active':
          return s
        case '.ant-steps-item-icon > .ant-steps-icon':
          return s
        case '.ant-select-item-option-selected:not(.ant-select-item-option-disabled)':
          return s
        default:
          if (s.indexOf('.ant-btn') >= -1) {
            // 按钮被重新定制过，需要过滤掉class防止覆盖
            return s
          }
      }
      return s.startsWith('[data-theme') ? s : `[data-theme] ${s}`
    },
    colorVariables: [...getThemeColors(), ...colors],
  })
  vite_theme_plugin.forEach(function (item) {
    //对vite:theme插件特殊配置
    if ('vite:theme' === item.name) {
      // 打包时去除enforce: "post"，vite 2.6.x适配，否则生成app-theme-style为空，因为async transform(code, id) {的code没有正确获取
      if (isBuild) {
        delete item.enforce
      }
    }
  })

  const plugin = [
    vite_theme_plugin,
    antdDarkThemePlugin({
      preloadFiles: [path.resolve(process.cwd(), 'src/design/index.less')],
      filter: (id) => (isBuild ? !id?.endsWith('antd.less') : true),
      // extractCss: false,
      darkModifyVars: {
        ...generateModifyVars(),
        'text-color': '#c9d1d9',
        'primary-1': 'rgb(255 255 255 / 8%)',
        'text-color-base': '#c9d1d9',
        'component-background': '#151515',
        'heading-color': 'rgb(255 255 255 / 65%)',
        'text-color-secondary': '#8b949e',
        'border-color-base': '#303030',
        'header-light-bottom-border-color': '#303030',
        'item-active-bg': '#111b26',
        'app-content-background': '#1e1e1e',
        'tree-node-selected-bg': '#11263c',
        'alert-success-border-color': '#274916',
        'alert-success-bg-color': '#162312',
        'alert-success-icon-color': '#49aa19',
        'alert-info-border-color': '#153450',
        'alert-info-bg-color': '#111b26',
        'alert-info-icon-color': '#177ddc',
        'alert-warning-border-color': '#594214',
        'alert-warning-bg-color': '#2b2111',
        'alert-warning-icon-color': '#d89614',
        'alert-error-border-color': '#58181c',
        'alert-error-bg-color': '#2a1215',
        'alert-error-icon-color': '#a61d24',
      },
    }),
  ]

  return plugin as unknown as PluginOption[]
}
