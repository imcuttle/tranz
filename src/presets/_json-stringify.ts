/**
 * @file json-parse
 * @author Cuttle Cong
 * @date 2018/9/29
 *
 */

export default function stringify({ replacer = null, space }: { replacer?: any; space?: any } = {}) {
  return function(input) {
    return JSON.stringify(input, replacer, space)
  }
}
