// #!/usr/bin/env node

import { runBuildConfig } from './buildConf'

export const runBuild = async () => {
  try {
    const argvList = process.argv.splice(2)
    // Generate configuration file
    if (!argvList.includes('disabled-config')) {
      runBuildConfig()
    }
  } catch {
    process.exit(1)
  }
}
runBuild()
