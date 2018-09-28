/**
 * @file normalizeProcessor
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
import * as resolveFrom from 'resolve-from'
import interop from 'module-interop'
import * as loaderUtils from 'loader-utils'

import { Processor, ProcessorCore } from './index'
import fillWhenUndefined from './fillWhenUndefined'

export function normalizeProcessorPath(
  processor: Processor,
  { cwd } = { cwd: process.cwd() }
): [string, any] | ProcessorCore {
  if (typeof processor === 'string') {
    const lastIndex = processor.lastIndexOf('?')
    let opts = null
    if (lastIndex >= 0) {
      opts = loaderUtils.parseQuery(processor.slice(lastIndex))
      processor = processor.slice(0, lastIndex)
    }

    return [resolveFrom(cwd, processor), opts]
  }
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    const [fnName, opts = null] = processor
    return [resolveFrom(cwd, fnName), opts]
  }

  return processor
}

export default function normalizeProcessor(processor: Processor, { cwd } = { cwd: process.cwd() }): ProcessorCore {
  processor = normalizeProcessorPath(processor, { cwd })
  // [string, any]
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    const [fnName, opts = null] = processor
    return fillWhenUndefined(interop(require(fnName as string))(opts), { id: fnName })
  }

  return processor as ProcessorCore
}
