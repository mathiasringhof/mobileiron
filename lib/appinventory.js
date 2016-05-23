'use strict'

const rp = require('request-promise')
const Readable = require('stream').Readable

/**
 * Convenience function to create an options object for MobileIron Device API call
 * @param {Object} baseOpts - Object containing basic connection properties. See createBaseOpts.
 * @param {string} adminDeviceSpaceId - See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details. Try 1 if not sure.
 * @param {Array} deviceUuids - Array of UUIDs of devices that should be queried. Maximum number is 25 if using getAppInventory(). See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const createAppInventoryOpts = (baseOpts, adminDeviceSpaceId, deviceUuids) =>
  Object.assign({}, baseOpts, {
    adminDeviceSpaceId,
    deviceUuids
  })

const buildAppInventoryQuery = (baseUrl, adminDeviceSpaceId, deviceUuids) =>
  `${baseUrl}/api/v2/devices/appinventory?adminDeviceSpaceId=${adminDeviceSpaceId}&deviceUuids=${deviceUuids.join(',')}`

/**
 * Queries MobileIron's app inventory API to retrieve the installed apps of the devices requested.
 * @param {Object} opts - Should contain baseUrl, username, password, and adminDeviceSpaceId deviceUuids. See createAppInventoryOpts().
 * @returns {Array} App inventory of devices that matched provided UUIDs. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const getAppInventory = (opts) =>
  rp({
    url: buildAppInventoryQuery(opts.baseUrl, opts.adminDeviceSpaceId, opts.deviceUuids),
    auth: {
      username: opts.username,
      password: opts.password
    },
    json: true
  }).then(response => response.results)

class InventoryStream extends Readable {
  constructor (deviceOpts, highWaterMark) {
    super({objectMode: true, highWaterMark})
    this.opts = deviceOpts
    this.currentUuidIndex = 0
  }

  sliceUuids (opts, begin, end) {
    return Object.assign({}, opts, {
      deviceUuids: opts.deviceUuids.slice(begin, end)
    })
  }

  _read (size) {
    console.error('Reading %s records, current offset %s', size, this.currentUuidIndex)
    if (this.currentUuidIndex >= this.opts.deviceUuids.length) {
      return this.push(null)
    }
    getAppInventory(this.sliceUuids(this.opts, this.currentUuidIndex, this.currentUuidIndex + size)).then((apps) => {
      console.error('Got %s records', apps.length)
      this.push(apps)
    })
    this.currentUuidIndex = this.currentUuidIndex + size
  }
}

/**
 * Calls MobileIron's app inventory API as many times as possible to return a full inventory of the devices requested.
 * @param {Object} opts - Should contain baseUrl, username, password, adminDeviceSpaceId and deviceUuids. See createAppInventoryOpts().
 * @param {Number} batchSize - Defines for how many devices the app inventory will be pulled at the same time. Default and maximum is 25. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 * @returns {InventoryStream} Object (!) stream of the app inventory of devices that matched provided UUIDs. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const createAppInventoryStream = (opts, batchSize) => new InventoryStream(opts, batchSize || 25)

module.exports = {
  createAppInventoryOpts,
  buildAppInventoryQuery,
  getAppInventory,
  createAppInventoryStream
}
