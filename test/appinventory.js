'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert

const mi = require('../lib')
const appinventory = require('../lib/appinventory')
const nock = require('nock')

const HOST = 'http://test.mobileiron'
const PATH = '/company'
const BASE_URL = `${HOST}${PATH}`
const BASE_OPTS = {
  baseUrl: BASE_URL,
  username: '123',
  password: 'abc'
}
const DEVICES = [ 'abc-123', 'def-456' ]

describe('appinventory', function () {
  describe('buildAppInventoryQuery', function () {
    it('should build a proper query', function () {
      const result = appinventory.buildAppInventoryQuery(BASE_URL, 1, DEVICES)
      console.log(result)
    })
  })
})
