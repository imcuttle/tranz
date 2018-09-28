/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
import tranz from '../src'
import tranzLib from '../lib'
import fillWhenUndefined from '../src/fillWhenUndefined'
import * as nps from 'path'

const fixture = (name = '') => nps.join(__dirname, 'fixture', name)
describe('tranz', function() {
  it('should fillWhenUndefined', function() {
    expect(fillWhenUndefined({ par: undefined, ch: 'ok' }, { par: false, ch: 'ww' }, { par: null })).toEqual({
      par: null,
      ch: 'ok'
    })
  })

  it('tranz-spec', async function() {
    const output = await tranz('heihei', [
      require('./fixture/processor-wrapper')({ char: '`' }),
      require('./fixture/processor-upper')()
    ])

    expect(output).toBe('`HEIHEI`')
  })

  it('tranz-string processor', async function() {
    const output = await tranz('heihei', ['./fixture/processor-wrapper?char=`', './fixture/processor-upper'], {
      cwd: __dirname
    })

    expect(output).toBe('`HEIHEI`')
  })

  it('tranz-string processor item instanceof array', async function() {
    const output = await tranz(
      'heihei',
      [['./fixture/processor-wrapper', { char: '`' }], './fixture/processor-upper'],
      { cwd: __dirname }
    )

    expect(output).toBe('`HEIHEI`')
  })

  it('tranz-string processor item instanceof array', async function() {
    const output = await tranz(
      'heihei',
      [['./fixture/processor-wrapper', { char: '`' }], './fixture/processor-upper'],
      { cwd: __dirname }
    )

    expect(output).toBe('`HEIHEI`')
  })

  it('tranz-string processor item instanceof array', async function() {
    const output = await tranz(
      'heihei',
      [['./fixture/processor-wrapper', { char: '`' }], './fixture/processor-upper'],
      { cwd: __dirname }
    )

    expect(output).toBe('`HEIHEI`')
  })

  it('tranz-string processor item throws error with id', async function() {
    let error
    try {
      await tranz('heihei', [['./fixture/processor-error', { char: '`' }], './fixture/processor-upper'], {
        cwd: __dirname
      })
    } catch (e) {
      error = e
    }
    expect(String(error)).toContain(`TranzError: Error occurs when process using \``)
  })

  it('tranz-string processor item throws error non-id', async function() {
    let error
    try {
      let rlt = await tranz('heihei', [require('./fixture/processor-error')()], {
        cwd: __dirname
      })
      console.log(String(rlt))
    } catch (e) {
      error = e
    }
    expect(String(error)).toContain(`TranzError: Error occurs when process: heihei`)
  })

  it('parallel throw error', async function() {
    let error
    try {
      let rlt = await tranzLib('heihei', [require('./fixture/processor-upper')()], {
        cwd: __dirname,
        parallel: true
      })
    } catch (e) {
      error = e
    }
    expect(String(error)).toContain(
      `Expected \`processor\` to be of type \`string | [string, any]\`, got \`Function\` or \`Function[]\` when parallel is enabled`
    )
  })

  it('parallel works well', async function() {
    let rlt = await tranzLib('heihei', ['./fixture/processor-upper', ['./fixture/processor-wrapper', { char: 'l' }]], {
      cwd: __dirname,
      parallel: true
    })
    expect(rlt).toBe('lHEIHEIl')
  })

  it('parallel works well transform object', async function() {
    let rlt = await tranzLib(undefined, ['./fixture/processor-object'], {
      cwd: __dirname,
      parallel: true
    })
    expect(rlt).toEqual({ i: 1 })
  })
})

describe('integration test', () => {
  it('should local-path inner cwd', async function() {
    expect(await tranz('nihao', [], { cwd: fixture('local-path/cwd') })).toBe('ABCNIHAOABC')
  })

  it('should local-path', async function() {
    expect(await tranz('nihao', [], { cwd: fixture('local-path') })).toBe('ABCNIHAOABC')
  })

  it('should use processors in argument', async function() {
    expect(await tranz('nihao', ['../../processor-upper.js'], { cwd: fixture('local-path/cwd') })).toBe('NIHAO')
  })

  it('should node_modules-path inner cwd', async function() {
    expect(await tranz('nihao', [], { cwd: fixture('node_modules-path/cwd/cwd') })).toBe('halala')
  })
})
