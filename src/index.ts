/**
 * The framework for transform anything
 * @author imcuttle
 */
import * as reduce from 'p-reduce'
import * as pify from 'pify'
import * as farm from '@moyuyc/worker-farm'
import * as isEmp from 'lodash.isempty'
import * as VError from 'verror'
import * as cosconfig from 'cosmiconfig'
import { single, default as quote } from 'quote-it'
import { stringify, parse } from 'json-buffer'
import { dirname } from 'path'

import runProcessor from './runProcessor'
import fillWhenUndefined from './fillWhenUndefined'

export type ProcessFunction = Function & { id?: string }
export type ProcessFunctions = { id: string } & Function[]

export type ProcessorCore = ProcessFunction | ProcessFunctions

export type Processor = string | ProcessorCore | [string, any]
type ComOptions = {
  parallel?: boolean
}
export type Options = ComOptions & {
  cwd?: string
  userc?: boolean
}

export type RCOptions = ComOptions & {
  processors: Processor[]
}

export const explorer = cosconfig(require('../package.json').name)

export default async function tranz(input: any, processors: Processor[] = [], opts: Options = {}): Promise<any> {
  opts = { userc: true, cwd: process.cwd(), ...opts }
  let processorCwd = opts.cwd
  if (opts.userc) {
    const { config, filepath, isEmpty } = (await explorer.search(processorCwd)) || ({} as any)
    if (!isEmpty && config) {
      const tConfig: RCOptions = { ...config }
      if (isEmp(processors)) {
        processorCwd = dirname(filepath)
        processors = tConfig.processors || []
      }
      delete tConfig.processors
      delete (tConfig as any).userc
      delete (tConfig as any).cwd
      opts = { ...tConfig, ...opts }
    }
  }

  fillWhenUndefined(opts, { parallel: false })

  let run = (input, processor) => {
    return runProcessor(input, processor, { ...opts, cwd: processorCwd })
  }

  let runner
  let output
  try {
    if (opts.parallel) {
      runner = farm(require.resolve('./child'))
      run = (input, processor) => {
        if (
          typeof processor === 'function' ||
          (Array.isArray(processor) && processor.some(x => typeof x === 'function'))
        ) {
          throw new VError(
            {
              name: 'TranzError'
            },
            'Expected `processor` to be of type `string | [string, any]`, got `Function` or `Function[]` when parallel is enabled'
          )
        }
        return pify(runner)(stringify([input, processor, processorCwd, opts])).then(string => parse(string))
      }
    }

    output = await reduce(
      processors,
      async function(input, processor) {
        return await run(input, processor)
      },
      input
    )
  } catch (e) {
    throw e
  } finally {
    if (opts.parallel && runner) {
      farm.end(runner)
    }
  }
  return output
}
