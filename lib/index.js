'use strict'

const rp = require('request-promise')

const buildPingQuery = baseUrl =>
  `${baseUrl}/api/v2/ping`

/**
 * Pings a MobileIron instance's V2 API
 * @param {string} baseUrl - The URL of your MobileIron instance. Add /rest at the end if using connected cloud.
 * @param {string} username - Admin user that has API access. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 * @param {string} password - Admin user that has API access. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const ping = (baseUrl, username, password) =>
  rp({
    url: buildPingQuery(baseUrl),
    auth: {
      username,
      password
    },
    json: true
  }).then(response => response.results)

const buildDevicesQuery = (baseUrl, fields, query, adminDeviceSpaceId) =>
  `${baseUrl}/api/v2/devices?adminDeviceSpaceId=${adminDeviceSpaceId}&fields=${fields.join(',')}&query=${query}`

/**
 * Queries MobileIron's devices API to retrieve device information
 * @param {Object} options - Should contain baseUrl, username, password, fields, query and adminDeviceSpaceId. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 */
const devices = (opts) =>
  rp({
    url: buildDevicesQuery(opts.baseUrl, opts.fields, opts.query, opts.adminDeviceSpaceId),
    auth: {
      username: opts.username,
      password: opts.password
    },
    json: true
  }).then(response => response.results)

module.exports = {
  devices,
  ping
}
