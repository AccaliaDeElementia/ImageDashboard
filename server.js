'use sanity'

require('./db')
  .initialize
  .then(require('./http').startServer)
  .then(require('./images').syncImages)
