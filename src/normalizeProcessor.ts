/**
 * @file normalizeProcessor
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
import * as resolveFrom from 'resolve-from'
import interop from 'module-interop'
import { single } from 'quote-it'
import * as execa from 'execa'
import { join } from 'path'
import * as loaderUtils from 'loader-utils'

import { ProcessFunction, Processor, ProcessorCore } from './index'
import fillWhenUndefined from './fillWhenUndefined'

export type Options = { cwd?: string }

const makeShell = (shellCommand: string, { cwd = process.cwd() }: Options = {}): ProcessFunction => {
  return async value => {
    try {
      return (await execa.shell(shellCommand, { cwd, input: value })).stdout
    } catch (rlt) {
      throw new Error(
        `run command ${single(rlt.cmd)} with exit code: ${rlt.code}` + (rlt.stderr ? `\n${rlt.stderr}` : '')
      )
    }
  }
}

export function resolveProcessor(
  moduleId: string,
  { cwd = process.cwd(), allowShell = true }: Options & { allowShell?: boolean } = {}
): { type: 'module' | 'shell'; value: string } {
  const makeModule = (value: string) => {
    return { type: 'module', value } as any
  }

  try {
    return makeModule(resolveFrom(cwd, moduleId))
  } catch (e) {
    if (e.code === 'MODULE_NOT_FOUND') {
      // Resolve preset
      try {
        return makeModule(require.resolve(join(__dirname, 'presets', moduleId)))
      } catch (presetErr) {
        if (presetErr.code === 'MODULE_NOT_FOUND') {
          // Treat as shell script
          if (allowShell) return { type: 'shell', value: moduleId }
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
    let sliced = processor
    if (lastIndex >= 0) {
      opts = loaderUtils.parseQuery(processor.slice(lastIndex))
      sliced = processor.slice(0, lastIndex)
    }
    const rlt = resolveProcessor(sliced, { cwd })
    if (rlt.type === 'module') {
      return [rlt.value, opts]
    }
    return makeShell(processor, { cwd })
  }
  if (Array.isArray(processor) && typeof processor[0] === 'string') {
    const [fnName, opts] = processor
    return [resolveProcessor(fnName as string, { cwd, allowShell: false }).value, opts]
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
