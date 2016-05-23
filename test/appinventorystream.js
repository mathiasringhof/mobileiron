'use strict'

const chai = require('chai')
const chaiAsPromised = require('chai-as-promised')
chai.use(chaiAsPromised)
const assert = chai.assert
const Promise = require('bluebird')

const AppInventoryStream = require('../lib/appinventorystream')
const Writable = require('stream').Writable

describe('AppInventoryStream', function () {
  it('should properly emit an "end" event after querying all devices', function (done) {
    const TEST_OPTS = {
      deviceUuids: Array.apply(null, Array(100)).map((_, i) => i)
    }
    const getFakeAppInventory = () => Promise.resolve([{ foo: 'bar' }])
    let chunkCount = 0
    const writable = new Writable({
      write: function (chunk, encoding, next) {
        chunkCount++
        next()
      },
      objectMode: true
    })
    const stream = new AppInventoryStream(TEST_OPTS, 10, getFakeAppInventory)
    stream.on('end', () => {
      assert.equal(chunkCount, 10, 'We should receive 10 chunks before an end event')
      done()
    })
    stream.pipe(writable)
  })
})
