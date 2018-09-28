/**
 * @file runProcessor
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
import * as reduce from 'p-reduce'
import * as VError from 'verror'
import quote from 'quote-it'
import { ProcessFunctions, Processor } from './index'
import normalizeProcessor from './normalizeProcessor'

export default async function runProcessor(input, processor: Processor, options?: any) {
  processor = normalizeProcessor(processor, options)

  let processorArray = processor
  if (!Array.isArray(processor)) {
    processorArray = [processor as Function] as ProcessFunctions
  }

  try {
    return await reduce(processorArray, (input, runner) => runner(input), input)
  } catch (e) {
    const processorId = processor.id
    throw new VError(
      { cause: e, name: 'TranzError' },
      `Error occurs when process` + (processorId ? ` using ${quote(String(processorId), '`')}` : '')
    )
  }
}
