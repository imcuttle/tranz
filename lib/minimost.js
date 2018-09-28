'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file minimost
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
var minimist = require('minimist')
var Opts = minimist.Opts
var kebab2camel = function(input) {
  return input.replace(/([a-z])-([a-z])/g, function(_, p1, p2) {
    return p1 + p2.toUpperCase()
  })
}
function default_1(argv, options) {
  var parsed = minimist(
    argv,
    Object.assign(
      {
        '--': true
      },
      options
    )
  )
  var input = parsed._
  delete parsed._
  var flags = {}
  // eslint-disable-next-line guard-for-in
  for (var key in parsed) {
    flags[kebab2camel(key)] = parsed[key]
  }
  return { input: input, flags: flags }
}
exports.default = default_1
//# sourceMappingURL=minimost.js.map
