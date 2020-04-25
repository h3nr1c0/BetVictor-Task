/* 
 * Test BetVictor
 * Test events route
*/

/* eslint-disable no-unused-expressions */
/* eslint-disable no-undef */
const supertest = require('supertest')
var expect = require('chai').expect
// const fetch = require('node-fetch')

require('dotenv').config()

const eventsBaseRoute = supertest(`http://localhost:${process.env.SERVER_PORT}/events`)
const sportsBaseRoute = supertest(`http://localhost:${process.env.SERVER_PORT}/sports`)

const timeOut = 50000

let sports_EN = [] // used to avoid using known sport id
let validSportId, invalidSportId
let validEvent

function getEventsOfSport(sportId, sports) {
  const found_sports = sports.filter(s => s.id === sportId)
  const eventsOfSport = []
  found_sports.map(s => {
    s.comp.map(competition => {
      if (competition.events) {
        competition.events.map(event => {
          eventsOfSport.push(event)
        })
      }
    })
  })
  return eventsOfSport
}

const pickSportId = (existing, array) => {
  if (!Array.isArray(array)) return 0
  if (existing) { // pick 1 from existing events
    const arrIndex = Math.floor(Math.random() * array.length)
    if (array[arrIndex]) return array[arrIndex].id
  } else { // unknown/invalid id
    let id = 1
    while (true) {
      if (array.filter(e => { e.id === id }).length > 0) {
        id += 1
      } else {
        return id
      }
    }
  }
}

const pickEvent = (sportId, sports) => {
  const eventsOfSport = getEventsOfSport(sportId, sports)
  if (!eventsOfSport || eventsOfSport.length == 0) {
    throw new Error(`no events for sport with id: ${sportId}`)
  }
  const arrIndex = Math.floor(Math.random() * eventsOfSport.length)
  if (eventsOfSport[arrIndex]) return eventsOfSport[arrIndex]
}


describe('Test events route', function () {
  this.timeout(timeOut)

  before(`should return all english sports `, (done) => {
    supertest(`https://partners.betvictor.mobi/en-gb/in-play/1/events`)
      .get('')
      .end(function (_err, res) {
        const sports_count = res.body.result.sports.length
        sportsBaseRoute
          .get('?lang=en-gb')
          .end(function (_err, res) {
            if (_err) throw _err
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array').that.is.not.empty
            expect(res.body.length).to.equal(sports_count)

            sports_EN = JSON.parse(JSON.stringify(res.body))

            validSportId = pickSportId(true, sports_EN)
            invalidSportId = pickSportId(false, sports_EN)
            validEvent = pickEvent(validSportId, sports_EN)
            done()
          })
      })
  })

  it(`should return all events WITH event count check`, (done) => {
    let events_count = 0
    supertest(`https://partners.betvictor.mobi/en-gb/in-play/1/events`)
      .get('')
      .end(function (_err, res) {
        events_count += res.body.result.total_number_of_events
        supertest(`https://partners.betvictor.mobi/de-de/in-play/1/events`)
          .get('')
          .end(function (_err, res) {
            events_count += res.body.result.total_number_of_events
            supertest(`https://partners.betvictor.mobi/cn-cn/in-play/1/events`)
              .get('')
              .end(function (_err, res) {
                events_count += res.body.result.total_number_of_events
                eventsBaseRoute
                  .get('')
                  .end(function (_err, res) {
                    if (_err) throw _err
                    expect(res.statusCode).to.equal(200)
                    expect(res.body).to.be.an('array').that.is.not.empty
                    expect(res.body.length, 'sum of total_number_of_events for all languages is not the same as all events').to.equal(events_count)
                    done()
                  })
              })
          })
      })
  })

  it(`should return all events without event count check`, (done) => {
    eventsBaseRoute
      .get('')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        done()
      })
  })

  it(`should return data of a known event`, (done) => {
    // get all events
    eventsBaseRoute
      .get('')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        eventsBaseRoute
          .get(`/${validSportId}/events/${validEvent.id}`)
          .end(function (_err, res) {
            if (_err) throw _err
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.not.be.empty
            // get last of found events
            const response_item = res.body.pop()
            // compare main fields with valid event, timestamps may vary
            expect(response_item.id).to.eql(validEvent.id)
            expect(response_item.event_type).to.eql(validEvent.event_type)
            expect(response_item.event_path_id).to.eql(validEvent.event_path_id)
            expect(response_item.sport_id).to.eql(validEvent.sport_id)
            expect(response_item.desc).to.eql(validEvent.desc)
            expect(response_item.oppADesc).to.eql(validEvent.oppADesc)
            expect(response_item.oppAId).to.eql(validEvent.oppAId)
            expect(response_item.oppBDesc).to.eql(validEvent.oppBDesc)
            expect(response_item.oppBId).to.eql(validEvent.oppBId)
            done()
          })
      })
  })

  it(`should return events of sport of selected by id`, (done) => {
    // get sport Ids
    sportsBaseRoute
      .get('')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        sports_EN = new Object(res.body)
        const eventsOfSport = getEventsOfSport(validSportId, sports_EN)
        const sortedEvents = eventsOfSport.sort((a, b) => a.pos - b.pos)

        eventsBaseRoute
          .get(`?sportId=${validSportId}`)
          .end(function (_err, res) {
            if (_err) throw _err
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array').that.is.not.empty
            expect(res.body.length).to.equal(sortedEvents.length)
            expect(res.body).to.be.eql(sortedEvents)
            done()
          })
      })
  })

  it(`should NOT return events of sport with unknown id`, (done) => {
    // get sport Ids
    sportsBaseRoute
      .get('')
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        eventsBaseRoute
          .get(`?sportId=${invalidSportId}`)
          .end(function (_err, res) {
            if (_err) throw _err
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.be.an('array').that.is.empty
            done()
          })
      })
  })

  it(`Should return events of known sportId`, function (done) {
    eventsBaseRoute
      .get(`?sportId=${validSportId}`)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.not.empty
        const filtered_events = getEventsOfSport(validSportId, sports_EN)
        const sorted = filtered_events.sort((a, b) => a.pos - b.pos)
        expect(res.body.length).to.equal(sorted.length)
        done()
      })
  })

  it(`Should not return events of unknown sportId`, function (done) {
    eventsBaseRoute
      .get(`?sportId=${invalidSportId}`)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.empty
        done()
      })
  })

  const invalidEventId = 555555
  it(`Should not return data of unknown event with Id: ${invalidEventId}`, function (done) {
    eventsBaseRoute
      .get(`/${validSportId}/events/${invalidEventId}`)
      .end(function (_err, res) {
        if (_err) throw _err
        expect(res.statusCode).to.equal(200)
        expect(res.body).to.be.an('array').that.is.empty
        done()
      })
  })
})
