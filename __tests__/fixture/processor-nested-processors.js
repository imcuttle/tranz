/**
 * @file processor-error
 * @author Cuttle Cong
 * @date 2018/9/28
 *
 */

module.exports = ({ char = '' } = {}) => [
  [require.resolve('./processor-wrapper'), { char }],
  require('./processor-wrapper').default({ char: 'p' }),
  require.resolve('./processor-wrapper') + '?char=q',
  function(input) {
    return String(this.prefix) + input
  }
]
