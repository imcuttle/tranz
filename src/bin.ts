/**
 * @file bin
 * @author Cuttle Cong
 * @date 2018/9/28
 */
import minimost from './minimost'
import tranz from './'
import * as concat from 'concat-stream'
import { throws } from 'assert'

const pkg = require('../package')

const arg = minimost(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    p: 'processors',
    i: 'input',
    processor: 'processors'
  },
  default: {
    userc: true
  },
  boolean: ['help', 'userc', 'parallel']
}) as any

function run(input, processors, opts) {
  input = String(input)
  return tranz(input, processors, opts)
    .then(output => {
      output = String(output)
      process.stdout.write(output)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

// console.log(arg)
;(function() {
  if (arg.help) {
    return console.log(`
    
    ${pkg.name} ${pkg.version}
    
    ${pkg.description}
    
    Usage
    
      ${pkg.name} [options]
      
    Options
    
      -h, --help          More help
      -v                  Version
      -p, --processor     Set processor (e.g. \`-p ./trans -p upper\`)
      -i, --input         Set input (e.g. \`-i $PWD\`)
      --no-userc          Disable runtime configuration
      --parallel          Run processor parallelly
    
    Examples
      
      ${pkg.name} -i $PWD -p ./upper
      cat $PWD | ${pkg.name} -p ./upper
  `)
  }

  if (arg.flags.version) {
    return console.log(pkg.version)
  }

  const processors = arg.flags.processors
    ? Array.isArray(arg.flags.processors)
      ? arg.flags.processors
      : [arg.flags.processors]
    : void 0

  if (typeof arg.flags.input !== 'undefined') {
    run(arg.flags.input, processors, {
      userc: arg.flags.userc,
      parallel: arg.flags.parallel
    })
  } else {
    process.stdin.pipe(
      concat(function(string) {
        run(String(string), processors, {
          userc: arg.flags.userc,
          parallel: arg.flags.parallel
        })
      })
    )
  }
})()
