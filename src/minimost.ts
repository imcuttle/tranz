/**
 * @file minimost
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */
import * as minimist from 'minimist'
const { Opts } = minimist

/* istanbul ignore next: forked from 3rd-party */
const kebab2camel = (input: string) => {
  return input.replace(/([a-z])-([a-z])/g, (_, p1, p2) => {
    return p1 + p2.toUpperCase()
  })
}

export default function(argv: string[], options?) {
  const parsed = minimist(
    argv,
    Object.assign(
      {
        '--': true
      },
      options
    )
  )

  // console.log(parsed)
  const input = parsed._
  delete parsed._

  const flags: { [k: string]: any } = {}
  // eslint-disable-next-line guard-for-in
  for (const key in parsed) {
    flags[kebab2camel(key)] = parsed[key]
  }

  return { input, flags }
}
