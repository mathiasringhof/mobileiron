'use strict'
const Readable = require('stream').Readable

class AppInventoryStream extends Readable {
  constructor (deviceOpts, highWaterMark, getAppInventory) {
    super({objectMode: true, highWaterMark})
    this.opts = deviceOpts
    this.currentUuidIndex = 0
    this.getAppInventory = getAppInventory
  }

  sliceUuids (opts, begin, end) {
    return Object.assign({}, opts, {
      deviceUuids: opts.deviceUuids.slice(begin, end)
    })
  }

  _read (size) {
    if (this.currentUuidIndex >= this.opts.deviceUuids.length) {
      return this.push(null)
    }
    this.getAppInventory(this.sliceUuids(this.opts, this.currentUuidIndex, this.currentUuidIndex + size)).then((apps) => {
      this.push(apps)
    })
    this.currentUuidIndex = this.currentUuidIndex + size
  }
}

module.exports = AppInventoryStream
