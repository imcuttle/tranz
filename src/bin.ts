/**
 * @file bin
 * @author Cuttle Cong
 * @date 2018/9/28
 */
import minimost from './minimost'
import tranz from './'
import * as concat from 'concat-stream'
import * as fs from 'fs'

const pkg = require('../package')

const arg = minimost(process.argv.slice(2), {
  alias: {
    h: 'help',
    v: 'version',
    p: 'processors',
    i: 'input',
    w: 'write',
    processor: 'processors'
  },
  default: {
    userc: true
  },
  boolean: ['help', 'userc', 'parallel', 'write']
}) as any

function run(input, processors, opts, from?) {
  input = String(input)
  return tranz(input, processors, opts)
    .then(output => {
      output = String(output)

      console.log(arg.flags.write, from)
      if (arg.flags.write && from) {
        return fs.writeFileSync(from, output)
      }

      if (arg.flags.to) {
        return fs.writeFileSync(arg.flags.to, output)
      }

      process.stdout.write(output)
    })
    .catch(error => {
      console.error(error)
      process.exit(1)
    })
}

console.log(arg)
;(function() {
  if (arg.flags.help) {
    console.log(`  ${pkg.name} ${pkg.version}: ${pkg.description}
  
  Usage
  
    ${pkg.name} [file] [options]
    
  Options
  
    -h, --help          More help
    -v                  Version
    -p, --processor     Set processor (e.g. \`-p ./trans -p upper\`)
    -i, --input         Set input (e.g. \`-i $PWD\`)
    --no-userc          Disable runtime configuration
    --parallel          Run processor parallelly
    -w, --write         Overwrite file by transformed string
    --to                Write file to where
  
  Examples
    
    ${pkg.name} -i $PWD -p ./upper
    cat $PWD | ${pkg.name} -p ./upper
  `)
    return
  }

  if (arg.flags.version) {
    return console.log(pkg.version)
  }

  const processors = arg.flags.processors
    ? Array.isArray(arg.flags.processors)
      ? arg.flags.processors
      : [arg.flags.processors]
    : void 0

  if (arg.input && arg.input.length) {
    arg.input.forEach(function(filename) {
      const input = fs.readFileSync(filename).toString()
      run(
        input,
        processors,
        {
          userc: arg.flags.userc,
          parallel: arg.flags.parallel
        },
        filename
      )
    })
  } else if (typeof arg.flags.input !== 'undefined') {
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
