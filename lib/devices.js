const rp = require('request-promise')

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
const getDevices = (opts) =>
  rp({
    url: buildDevicesQuery(opts.baseUrl, opts.fields, opts.query, opts.adminDeviceSpaceId),
    auth: {
      username: opts.username,
      password: opts.password
    },
    json: true
  }).then(response => response.results)

module.exports = {
  createDevicesOpts,
  buildDevicesQuery,
  getDevices
}
