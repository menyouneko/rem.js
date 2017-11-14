
let expect = chai.expect
let rem = new Rem()

describe('Instance', function () {
  it('rem should be instance of Rem', function () {
    expect(rem).to.be.an.instanceof(Rem)
  })

  it('rem should be equal Rem.instance', function () {
    expect(rem).to.be.eql(Rem.instance)
  })
})

describe('Effects', function () {
  it('document\'s root font-size should be set', function () {
    expect(window.document.documentElement.style.fontSize).to.not.eql('')
  })
})

describe('Others', function () {
  it('rem.config has config\'s property', function () {
    expect(rem.config).to.have.property('designWidth')
  })
})