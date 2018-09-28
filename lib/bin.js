'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file bin
 * @author Cuttle Cong
 * @date 2018/9/28
 */
var minimost_1 = require('./minimost')
var pkg = require('../package')
var arg = minimost_1.default(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    p: 'processors',
    processor: 'processors'
  },
  boolean: ['help']
})
console.log(arg)
;(function() {
  if (arg.help) {
    return console.log(
      '\n    \n    ' +
        pkg.name +
        ' ' +
        pkg.version +
        '\n    \n    ' +
        pkg.description +
        '\n    \n    Usage\n    \n      ' +
        pkg.name +
        ' <...files> [options]\n      \n    Options\n\n      -h, --help          More help\n      -v                  Version\n      -p, --processor     Set processor (e.g. `-p ./trans -p upper`)\n      --write             Overwrite files\n  '
    )
  }
  if (arg.version) {
    return console.log(pkg.version)
  }
})()
//# sourceMappingURL=bin.js.map
