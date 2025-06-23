/**
 * vite-plugin-imagemin: 用于在项目构建时自动优化图片资源，显著减小静态资源体积
 */
import viteImagemin from 'vite-plugin-imagemin'

export function configImageminPlugin() {
  const plugin = viteImagemin({
    // PNG
    gifsicle: {
      optimizationLevel: 7,
      interlaced: false,
    },
    // PNG
    optipng: {
      optimizationLevel: 7,
    },
    mozjpeg: {
      quality: 20,
    },
    pngquant: {
      quality: [0.8, 0.9],
      speed: 4,
    },
    // SVG
    svgo: {
      plugins: [
        {
          name: 'removeViewBox',
        },
        {
          name: 'removeEmptyAttrs',
          active: false,
        },
      ],
    },
  })
  return plugin
}
