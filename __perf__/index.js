/**
 * @file index
 * @author Cuttle Cong
 * @date 2018/9/29
 *
 */
const tranz = require('../').default
const Benchmark = require('benchmark')

const runPerf = (name, fn) => {
  let bench = fn(
    new Benchmark.Suite('num: 2', {
      onStart: () => console.log('Benchmark start: ' + name)
    })
  )
  bench
    .on('cycle', function(event) {
      console.log(String(event.target))
    })
    .on('complete', function() {
      console.log('Fastest is ' + this.filter('fastest').map('name') + '\n')
    })
    // run async
    .run({ async: false, defer: true })
}
const p = (num, opt) =>
  tranz(num, [require.resolve('./processor-hardwork'), require.resolve('./processor-hardwork')], opt)

runPerf('num: 100000', b =>
  b
    .add('tranz#parallel-a', function(deferred) {
      p(100000, { parallel: true }).then(() => deferred.resolve())
    })
    .add('tranz#norml-a', function(deferred) {
      p(100000).then(() => deferred.resolve())
    })
)

runPerf('num: 100000, but run normal case firstly', b =>
  b
    .add('tranz#norml-b', function(deferred) {
      p(100000).then(() => deferred.resolve())
    })
    .add('tranz#parallel-b', function(deferred) {
      p(100000, { parallel: true }).then(() => deferred.resolve())
    })
)

runPerf('num: 1000000, but run normal case firstly', b =>
  b
    .add('tranz#norml-c', function(deferred) {
      p(1000000).then(() => deferred.resolve())
    })
    .add('tranz#parallel-c', function(deferred) {
      p(1000000, { parallel: true }).then(() => deferred.resolve())
    })
)
