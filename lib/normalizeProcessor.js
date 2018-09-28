'use strict'
Object.defineProperty(exports, '__esModule', { value: true })
/**
 * @file normalizeProcessor
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
var resolveFrom = require('resolve-from')
var module_interop_1 = require('module-interop')
var loaderUtils = require('loader-utils')
var fillWhenUndefined_1 = require('./fillWhenUndefined')
function normalizeProcessorPath(processor, _a) {
  var cwd = (_a === void 0 ? { cwd: process.cwd() } : _a).cwd
  if (typeof processor === 'string') {
    var lastIndex = processor.lastIndexOf('?')
    var opts = null
    if (lastIndex >= 0) {
      opts = loaderUtils.parseQuery(processor.slice(lastIndex))
      processor = processor.slice(0, lastIndex)
    }
    return [resolveFrom(cwd, processor), opts]
  }
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    var fnName = processor[0],
      _b = processor[1],
      opts = _b === void 0 ? null : _b
    return [resolveFrom(cwd, fnName), opts]
  }
  return processor
}
exports.normalizeProcessorPath = normalizeProcessorPath
function normalizeProcessor(processor, _a) {
  var cwd = (_a === void 0 ? { cwd: process.cwd() } : _a).cwd
  processor = normalizeProcessorPath(processor, { cwd: cwd })
  // [string, any]
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    var fnName = processor[0],
      _b = processor[1],
      opts = _b === void 0 ? null : _b
    return fillWhenUndefined_1.default(module_interop_1.default(require(fnName))(opts), { id: fnName })
  }
  return processor
}
exports.default = normalizeProcessor
//# sourceMappingURL=normalizeProcessor.js.map
