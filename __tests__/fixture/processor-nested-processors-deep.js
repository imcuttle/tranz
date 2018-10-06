/**
 * @file processor-error
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports = ({ char = '' } = {}) => [
  [require.resolve('./processor-nested-processors'), { char }],
  function(input) {
    return input + String(this.suffix)
  }
]
