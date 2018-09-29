/**
 * @file processor-upper
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
module.exports = () => array => {
  array = array || []
  const num = Array.isArray(array) ? array.length : 1
  return new Array(Math.pow(num, num)).fill(1000).map(x => Math.random())
}
