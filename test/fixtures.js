const HOST = 'http://test.mobileiron'
const PATH = '/company'
const BASE_URL = `${HOST}${PATH}`
const BASE_OPTS = {
  baseUrl: BASE_URL,
  username: '123',
  password: 'abc'
}

module.exports = {
  HOST,
  PATH,
  BASE_URL,
  BASE_OPTS
}
