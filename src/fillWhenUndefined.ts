/**
 * @file fillWhenUndefined
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

export default function fillWhenUndefined(data, ...args) {
  const obj = Object.assign.apply(null, [{}].concat(args))
  Object.keys(obj).forEach(name => {
    if (typeof data[name] === 'undefined') {
      data[name] = obj[name]
    }
  })
  return data
}
