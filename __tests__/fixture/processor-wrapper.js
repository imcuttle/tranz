/**
 * @file processor-upper
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports.__esModule = true
module.exports.default = ({ char = '' } = {}) => [
  function(input) {
    return `${char}${input}${char}`
  }
]
