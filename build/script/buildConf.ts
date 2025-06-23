/**
 * 生成外部配置文件，用于生产发布后配置，无需重新打包
 */
import fs, { writeFileSync } from 'fs-extra'
import { GLOB_CONFIG_FILE_NAME, OUTPUT_DIR } from '../constant'

import { getConfigFileName } from '../getConfigFileName'
import { getEnvConfig, getRootPath } from '../utils'

interface CreateConfigParams {
  configName: string
  config: any
  configFileName?: string
}

function createConfig(params: CreateConfigParams) {
  const { configName, config, configFileName } = params
  try {
    const windowConf = `window.${configName}`
    // Ensure that the variable will not be modified
    let configStr = `${windowConf}=${JSON.stringify(config)};`
    configStr += `
      Object.freeze(${windowConf});
      Object.defineProperty(window, "${configName}", {
        configurable: false,
        writable: false,
      });
    `.replace(/\s/g, '')

    fs.mkdirp(getRootPath(OUTPUT_DIR))
    writeFileSync(getRootPath(`${OUTPUT_DIR}/${configFileName}`), configStr)
  } catch (error) {
    console.error('Error creating config file:', error)
  }
}

export function runBuildConfig() {
  const config = getEnvConfig()
  const configFileName = getConfigFileName(config)
  createConfig({ config, configName: configFileName, configFileName: GLOB_CONFIG_FILE_NAME })
}
