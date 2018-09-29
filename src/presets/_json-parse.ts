/**
 * @file json-parse
 * @author Cuttle Cong
 * @date 2018/9/29
 *
 */

export default function parse({ reviver }: { reviver?: any } = {}) {
  return function(input) {
    return JSON.parse(String(input), reviver)
  }
}
