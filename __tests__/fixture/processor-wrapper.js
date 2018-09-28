/**
 * @file processor-upper
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports = ({ char = '' } = {}) => [
  function(input) {
    return `${char}${input}${char}`
  }
]
