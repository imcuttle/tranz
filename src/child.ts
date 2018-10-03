/**
 * @file child
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

import { stringify, parse } from 'json-buffer'
import runProcessor from './runProcessor'

/* istanbul ignore next: should be run in lib/child.js */
module.exports = async function(parseAbleString: string, callback) {
  try {
    const [input, processor, cwd, opts] = parse(parseAbleString)
    const output = await runProcessor(input, processor, { ...opts, cwd })
    callback(null, stringify(output))
  } catch (e) {
    callback(e)
  }
}
