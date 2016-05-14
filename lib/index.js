'use strict'

const rp = require('request-promise')
const devices = require('./devices')
const appinventory = require('./appinventory')

/**
 * Convenience function to create an options object for MobileIron API calls 
 * @param {string} baseUrl - The URL of your MobileIron instance. Add /rest at the end if using connected cloud.
 * @param {string} username - Admin user that has API access. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 * @param {string} password - Admin user that has API access. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const createBaseOpts = (baseUrl, username, password) => {
  return {
    baseUrl,
    username,
    password
  }
}

const buildPingQuery = baseUrl =>
  `${baseUrl}/api/v2/ping`

/**
 * Pings a MobileIron instance's V2 API
 * @param {Object} opts - Should contain baseUrl, username, password. See createBaseOpts().
 * @returns {Object} MobileIron ping result, usually API and Core version. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const ping = (opts) =>
  rp({
    url: buildPingQuery(opts.baseUrl),
    auth: {
      username: opts.username,
      password: opts.password
    },
    json: true
  }).then(response => response.results)

module.exports = {
  createAppInventoryOpts: appinventory.createAppInventoryOpts,
  createBaseOpts,
  createDevicesOpts: devices.createDevicesOpts,
  createAppInventoryStream: appinventory.createAppInventoryStream,
  getDevices: devices.getDevices,
  getAppInventory: appinventory.getAppInventory,
  ping
}
