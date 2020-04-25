/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
var expect = require('chai').expect

require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}/sports`
const appBaseRoute = supertest(appBaseURL)

const timeOut = 50000

let sport

describe('Test sports route', function () {
  this.timeout(timeOut)

  it('should return English sports', function (done) {
    appBaseRoute
      .get('?lang=en-gb')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        done()
      })
  })
  
  it('should return German sports', function (done) {
    appBaseRoute
      .get('?lang=de-de')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        done()
      })
  })
  it('should return Chinese sports', function (done) {
    appBaseRoute
      .get('?lang=cn-cn')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        done()
      })
  })
  it('should return sports of all supported languages', function (done) {
    appBaseRoute
      .get('')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        done()
      })
  })  
})
