/**
 * @file main
 * @author imcuttle
 * @date 2018/4/4
 */
const nps = require('path')
const cli = require('gentle-cli')

const binPath = require.resolve('../bin')
const fixture = (name = '') => nps.join(__dirname, 'fixture', name)

const cmd = (cmd, opt?) => cli({ cwd: __dirname, ...opt }).use(`${binPath} ${cmd}`)
describe('tranz bin', function() {
  it('spec', function(done) {
    cmd('-i abc abc -p ./fixture/processor-upper -p ./fixture/processor-wrapper?char=222').end(function(err, { text }) {
      if (err) {
        return done(err)
      }
      expect(text).toEqual('222ABC222')
      done()
    })
  })

  it('spec json', function(done) {
    cmd(`-i ${JSON.stringify({ foo: 'bar' })} -p _json-parse -p ./fixture/processor-object`).end(function(
      err,
      { text }
    ) {
      if (err) {
        return done(err)
      }
      expect(text).toEqual('[object Object]')
      done()
    })
  })

  it('spec in-format: json, out-format: json', function(done) {
    cmd(
      `-i ${JSON.stringify({
        foo: 'bar'
      })} -p _json-parse -p ./fixture/processor-object -p _json-stringify?{"space":2}`
    ).end(function(err, { text }) {
      if (err) {
        return done(err)
      }
      expect(text).toEqual(JSON.stringify({ foo: 'bar', i: 1 }, null, 2))
      done()
    })
  })

  it('userc and parallel', function(done) {
    cmd(`-i foo --parallel`, { cwd: fixture('local-path/cwd') }).end(function(err, { text }) {
      if (err) {
        return done(err)
      }
      expect(text).toMatchInlineSnapshot(`"ABCFOOABC"`)
      done()
    })
  })

  it('nouserc', function(done) {
    cmd(`-i foo --no-userc`, { cwd: fixture('local-path/cwd') }).end(function(err, { text }) {
      if (err) {
        return done(err)
      }
      expect(text).toMatchInlineSnapshot(`"foo"`)
      done()
    })
  })
})
