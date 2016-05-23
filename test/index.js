'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert

const mobileiron = require('../lib')
const nock = require('nock')

const fixtures = require('./fixtures')

describe('mobileiron', function () {
  before(function () {
    nock.disableNetConnect()
  })

  after(function () {
    nock.enableNetConnect()
  })

  describe('ping', function () {
    it('should return the results object from <baseUrl>/api/v2/ping', function () {
      nock(fixtures.HOST)
        .get(`${fixtures.PATH}/api/v2/ping`)
        .reply(200, {
          results: {
            apiVersion: 2,
            vspVersion: 'VSP x.0.0.0 Build xxx '
          }
        })
      assert.eventually.deepEqual(mobileiron.ping(fixtures.BASE_OPTS),
        {
          apiVersion: 2,
          vspVersion: 'VSP x.0.0.0 Build xxx '
        })
    })
  })
})
