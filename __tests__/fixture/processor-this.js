/**
 * @file processor-upper
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports = () =>
  function(input) {
    return input ? [].concat(input).concat(this) : [this]
  }
