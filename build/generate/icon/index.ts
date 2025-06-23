import fs from 'fs-extra' // 提供更简单、更强大的文件操作方法（如递归复制、删除），并且支持Promise API。
import inquirer from 'inquirer' // 交互式命令行问答工具​
import path from 'path'

async function generateIcon() {
  const dir = path.resolve(process.cwd(), 'node_modules/@iconify/json')

  const raw = await fs.readJSON(path.join(dir, 'collections.json'))

  const collections = Object.entries(raw).map(([id, v]) => ({
    ...(v as any),
    id,
  }))

  const choices = collections.map((item) => ({ key: item.id, value: item.id, name: item.name }))
  const iconsChoices = [
    { key: 'local', value: 'local', name: 'Local' },
    { key: 'onLine', value: 'onLine', name: 'OnLine' },
  ]

  inquirer
    .prompt([
      {
        type: 'list',
        name: 'useType',
        choices: iconsChoices,
        message: 'How to use icons?',
      },
      {
        type: 'list',
        name: 'iconSet',
        choices: choices,
        message: 'Select the icon set that needs to be generated?',
      },
      {
        type: 'input',
        name: 'output',
        message: 'Select the icon set that needs to be generated?',
        default: 'src/components/Icon/data',
      },
    ])
    .then(async (answers: any) => {
      const { iconSet, output, useType } = answers
      const outputDir = path.resolve(process.cwd(), output)
      fs.ensureDir(outputDir)
      const genCollections = collections.filter((item) => [iconSet].includes(item.id))
      const prefixSet: string[] = []
      for (const info of genCollections) {
        const data = await fs.readJSON(path.join(dir, 'json', `${info.id}.json`))
        if (data) {
          const { prefix } = data
          const isLocal = useType === 'local'
          const icons = Object.keys(data.icons).map(
            (item) => `${isLocal ? prefix + ':' : ''}${item}`,
          )

          await fs.writeFileSync(
            path.join(output, `icons.data.ts`),
            `export default ${isLocal ? JSON.stringify(icons) : JSON.stringify({ prefix, icons })}`,
          )
          prefixSet.push(prefix)
        }
      }
      fs.emptyDir(path.join(process.cwd(), 'node_modules/.vite'))
    })
}

generateIcon()
