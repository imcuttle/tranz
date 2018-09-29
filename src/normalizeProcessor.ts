/**
 * @file normalizeProcessor
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
import * as resolveFrom from 'resolve-from'
import interop from 'module-interop'
import { join } from 'path'
import * as loaderUtils from 'loader-utils'

import { Processor, ProcessorCore } from './index'
import fillWhenUndefined from './fillWhenUndefined'

export type Options = { cwd?: string }

export function resolveProcessor(moduleId: string, { cwd = process.cwd() }: Options = {}): string {
  try {
    return resolveFrom(cwd, moduleId)
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      // Resolve preset
      try {
        return require.resolve(join(__dirname, 'presets', moduleId))
      } catch (presetErr) {
        if (presetErr.code === 'MODULE_NOT_FOUND') {
          throw e
        }
        throw presetErr
      }
    }
    throw e
  }
}

export function normalizeProcessorPath(
  processor: Processor,
  { cwd } = { cwd: process.cwd() }
): [string, any] | ProcessorCore {
  if (typeof processor === 'string') {
    const lastIndex = processor.lastIndexOf('?')
    let opts
    if (lastIndex >= 0) {
      opts = loaderUtils.parseQuery(processor.slice(lastIndex))
      processor = processor.slice(0, lastIndex)
    }

    return [resolveProcessor(processor, { cwd }), opts]
  }
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    const [fnName, opts] = processor
    return [resolveProcessor(fnName as string, { cwd }), opts]
  }

  return processor
}

export default function normalizeProcessor(processor: Processor, { cwd }: Options = {}): ProcessorCore {
  processor = normalizeProcessorPath(processor, { cwd })
  // [string, any]
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    const [fnName, opts] = processor
    return fillWhenUndefined(interop(require(fnName as string))(opts), { id: fnName })
  }

  return processor as ProcessorCore
}
