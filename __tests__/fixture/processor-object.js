/**
 * @file processor-error
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports = () => [
  obj => obj || {},
  obj => ((obj.i = obj.i || 0), Promise.resolve(obj)),
  obj => (obj.i++, Promise.resolve(obj))
]
