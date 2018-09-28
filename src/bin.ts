/**
 * @file bin
 * @author Cuttle Cong
 * @date 2018/9/28
 */
import minimost from './minimost'
import tranz from './'

const pkg = require('../package')

export type Flags = {
  help?: boolean
  version?: boolean
}
const arg = minimost(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    p: 'processors',
    processor: 'processors'
  },
  boolean: ['help']
}) as Flags

console.log(arg)
;(function() {
  if (arg.help) {
    return console.log(`
    
    ${pkg.name} ${pkg.version}
    
    ${pkg.description}
    
    Usage
    
      ${pkg.name} <...files> [options]
      
    Options

      -h, --help          More help
      -v                  Version
      -p, --processor     Set processor (e.g. \`-p ./trans -p upper\`)
      --write             Overwrite files
  `)
  }

  if (arg.version) {
    return console.log(pkg.version)
  }
})()
