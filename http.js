'use sanity'
const { createReadStream } = require('fs')
const { join } = require('path')
const { URL } = require('url')
const http = require('http')

const { getWeather } = require('./weather')
const { getImage } = require('./images')

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
  const image = getImage((Date.now() / 60 / 1000) | 0)
  streamFile(join('/data', image), res)
}

const serveData = (data, res) => {
  res.statusCode = 200
  res.end(JSON.stringify(data))
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
      case '/weather.json':
        serveData(getWeather(), res)
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
