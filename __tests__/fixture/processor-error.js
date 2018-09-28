/**
 * @file processor-error
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports = ({ char = '' } = {}) => input => {
  throw new Error(input)
}
