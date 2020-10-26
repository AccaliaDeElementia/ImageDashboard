'use sanity'
const { createReadStream } = require('fs')
const { join } = require('path')
const { URL } = require('url')
const http = require('http')

const streamFile = (file, res) => {
  var readStream = createReadStream(file)
  readStream.on('open', function () {
    readStream.pipe(res)
  })
  readStream.on('error', function (err) {
    console.error(err)
    res.end(err)
  })
}

const serveFile = (file, res) => {
  streamFile(join(__dirname, 'static', file), res)
}

const serveImage = async (res) => {
  const db = await require('./db').initialize
  const image = (await db('images').first('image').orderByRaw('random()')).image
  streamFile(join('/data', image), res)
}

exports.startServer = () => {
  http.createServer(function (req, res) {
    const url = new URL(req.url, 'http://localhost')
    switch (url.pathname) {
      case '/index.html':
      case '/':
        serveFile('index.html', res)
        break
      case '/index.js':
        serveFile('index.js', res)
        break
      case '/index.css':
        serveFile('index.css', res)
        break
      case '/image':
        serveImage(res)
        break
      default:
        res.statusCode = 404
        res.end('NOT FOUND')
    }
  }).listen(3030)
  return Promise.resolve()
}
