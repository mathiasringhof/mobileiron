'use strict'

const rp = require('request-promise')

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

/**
 * Convenience function to create an options object for MobileIron Device API call
 * @param {Object} baseOpts - Object containing basic connection properties. See createBaseOpts.
 * @param {Array} fields - Array of strings listing all fields that should be returned. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.   
 * @param {string} query - Query to filter results. Can't be empty. See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details.
 * @param {string} adminDeviceSpaceId - See MobileIronCoreV2APIGuideXX_RevXXXXXXXXX for details. Try 1 if not sure.
 */
const createDevicesOpts = (baseOpts, fields, query, adminDeviceSpaceId) =>
  Object.assign({}, baseOpts, {
    adminDeviceSpaceId,
    fields,
    query
  })

const buildDevicesQuery = (baseUrl, fields, query, adminDeviceSpaceId) =>
  `${baseUrl}/api/v2/devices?adminDeviceSpaceId=${adminDeviceSpaceId}&fields=${fields.join(',')}&query=${query}`

/**
 * Queries MobileIron's devices API to retrieve device information
 * @param {Object} opts - Should contain baseUrl, username, password, fields, query and adminDeviceSpaceId. See createDevicesOpts().
 * @returns {Array} All devices that matched query. All existing fields as keys.
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
  createBaseOpts,
  createDevicesOpts,
  devices,
  ping
}
