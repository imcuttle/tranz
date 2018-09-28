'use strict'
/**
 * @file fillWhenUndefined
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
Object.defineProperty(exports, '__esModule', { value: true })
function fillWhenUndefined(data) {
  var args = []
  for (var _i = 1; _i < arguments.length; _i++) {
    args[_i - 1] = arguments[_i]
  }
  var obj = Object.assign.apply(null, [{}].concat(args))
  Object.keys(obj).forEach(function(name) {
    if (typeof data[name] === 'undefined') {
      data[name] = obj[name]
    }
  })
  return data
}
exports.default = fillWhenUndefined
//# sourceMappingURL=fillWhenUndefined.js.map
