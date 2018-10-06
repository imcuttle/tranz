# tranz

[![Build status](https://img.shields.io/travis/imcuttle/tranz/master.svg?style=flat-square)](https://travis-ci.org/imcuttle/tranz)
[![Test coverage](https://img.shields.io/codecov/c/github/imcuttle/tranz.svg?style=flat-square)](https://codecov.io/github/imcuttle/tranz?branch=master)
[![NPM version](https://img.shields.io/npm/v/tranz.svg?style=flat-square)](https://www.npmjs.com/package/tranz)
[![NPM Downloads](https://img.shields.io/npm/dm/tranz.svg?style=flat-square&maxAge=43200)](https://www.npmjs.com/package/tranz)
[![Prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://prettier.io/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg?style=flat-square)](https://conventionalcommits.org)

The framework for transform anything

## Feature

- Allow running shell script as processor
- Allow concurrent multi-processor for fast speed
- Support runtime configuration

## Where use it?

- Transform git commit message for your self own processor.

  Use it with [husky (Git hooks made easy)](https://github.com/typicode/husky)

  ```json
  {
    "tranz": {
      "processors": ["echo '$(cat)\n\nbranch: $(git rev-parse --abbrev-ref HEAD)'"]
    },
    "husky": {
      "hooks": {
        "commit-msg": "npx tranz $HUSKY_GIT_PARAMS --write"
      }
    }
  }
  ```

  Then the end of commit message would be appended with current branch name.

## Installation

```bash
npm install tranz
# or use yarn
yarn add tranz
```

## Usage

### Package

#### `tranz(input: any, processors: Array<Function | [string, any] | string>, options?): Promise<any>`

- `index.js`

```javascript
import { join } from 'path'
import tranz from 'tranz'

tranz(
  'abc',
  [
    // function
    require('./lib/wrapper')({ c: '-' }),
    // return Processor[]
    require('./lib/multi-wrapper')({ c: 0 }),
    // [moduleId: string, options: any]
    ['./wrapper', { c: '_' }],
    // module name with query string
    './wrapper?c=$',
    // shell script
    // get input from stdin
    // output from stdout
    'echo $(cat)-abc'
  ],
  {
    // Resolve processor path's base dir
    // Default: $PWD
    cwd: join(__dirname, 'lib'),
    // Whether run tranz parallelly
    // Note: parallel mode could enabled when all of the processor is typeof `string` (serializable)
    // Default: false
    parallel: false,
    // Search runtime configuration.
    // e.g. 1. `tranz` field in `package.json`
    //      2. file named `.tranzrc`
    //      3. file named `.tranzrc.js`
    // Default: true
    userc: true
  }
).then(output => {
  console.log(output)
})

// Output:
// $_10-abc-01_$-abc
```

- `lib/wrapper.js`

```javascript
module.exports = ({ c }) =>
  function(input) {
    // this.cwd === __dirname
    // this.parallel === false
    // this.userc === true
    // `this` is equals to options shallowly

    return `${c}${input}${c}`
  }
```

- `lib/multi-wrapper.js`

```javascript
module.exports = ({ c }) => [input => `${c}${input}${c}`, input => Promise.resolve(`${c + 1}${input}${c + 1}`)]
```

### CLI

```
npm i tranz -D
npx tranz -h

tranz -i $PWD -p ./upper
cat $PWD | tranz -p ./upper
```

### RC Config

- `package.json`

```json
{
  "tranz": {
    "processors": [
      [
        "../processor-wrapper",
        {
          "char": "abc"
        }
      ],
      "../processor-upper",
      "module-p-fix?q=halala"
    ],
    "parallel": false
  }
}
```

### Bulit-in Processor

See [source code](src/presets)

- \_json-parse - run `JSON.parse(input, reviver?)`
- \_json-stringify - run `JSON.stringify(input, replacer?, space?)`

#### Example

```javascript
tranz({ key: 'foo' }, [['_json-stringify', { space: 2 }]]).then(output => {
  // {
  //   "key": "foo"
  // }
})
```

### Processor Inheritance

```
// This processor depends `./upper` and `./trimLeft` processor
module.exports = (opts) => [
  require('./upper')({}),
  [require.resolve('./trimLeft'), {}],
]
```

## Tests

### Unit

```bash
npm test
```

### Benchmark

```bash
npm run benchmark
```

## Roadmap

- [ ] file write [tranz-globs]
- [ ] file glob [tranz-globs]
- [ ] ignore files [tranz-globs]

## Related

## Authors

This library is written and maintained by imcuttle, <a href="mailto:moyuyc95@gmail.com">moyuyc95@gmail.com</a>.

## License

MIT
