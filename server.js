'use sanity'

let start = 0
Promise.resolve()
  .then(() => {
    start = Date.now()
    return Promise.resolve()
  })
  .then(require('./images').syncImages)
  .then(() => {
    console.log('Initial Sync Took', (Date.now() - start) / 1000, 'seconds')
    return Promise.resolve()
  })
  .then(require('./http').startServer)
  .then(() => setInterval(() => {
    require('./images').syncImages()
  }, 4 * 60 * 60 * 1000))
  .then(require('./weather').updateWeather)
  .then(setInterval(require('./weather').updateWeather, 10 * 60 * 1000))
