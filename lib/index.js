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

module.exports = {
  ping
}
