/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
var expect = require('chai').expect

require('dotenv').config()

const appBaseURL = `http://localhost:${process.env.SERVER_PORT}/events`
const appBaseRoute = supertest(appBaseURL)

const timeOut = 50000

describe('Test events end point', function () {
  this.timeout(timeOut)
  const sportId = 100
  it(`get events of sportId: ${sportId}`, function (done) {
    appBaseRoute
      .get(`?sportId=${sportId}`)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        // filter by sport_id of events
        const filteredResponse = res.body.filter(event => event.sport_id === sportId)
        // length of both results should match
        expect(res.body.length).to.be.equal(filteredResponse.length)
        done()
      })
  })
  it(`get all events`, function (done) {
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
  