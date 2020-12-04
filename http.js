'use sanity'
const { createReadStream, promises: { readFile } } = require('fs')
const { join, extname } = require('path')
const { URL } = require('url')
const http = require('http')
const socketio = require('socket.io')

const { getWeather } = require('./weather')
const { randomImage, advanceImage, currentImage } = require('./images')
const sharp = require('sharp')

const streamImage = async (file, res) => {
  const data = await readFile(file)
  const image = await sharp(data)
    .rotate()
    .resize(1920, 1080, {
      fit: sharp.fit.inside,
      withoutEnlargement: true
    })
    .toBuffer()
  res.end(image)
}
const streamFile = async (file, res) => {
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

const serveImage = async (req, res) => {
  const search = req.search.slice(1)
  const image = currentImage(search.length > 0 ? search : undefined)
  if (extname(image).toLowerCase() !== '.gif') {
    streamImage(join('/data', image), res)
  } else {
    streamFile(join('/data', image), res)
  }
}

const serveData = (data, res) => {
  res.statusCode = 200
  res.end(JSON.stringify(data))
}

const doWebSocket = (server) => {
  const io = socketio(server)
  const id = `${Math.random()}`.slice(2)
  io.on('connection', client => {
    client.emit('id', id)
    client.on('backimage', () => {
      changed = Date.now()
      io.emit('imagechange', advanceImage(-1))
    })
    client.on('nextimage', () => {
      changed = Date.now()
      io.emit('imagechange', advanceImage(1))
    })
  })
  randomImage()
  let changed = Date.now()
  setInterval(() => {
    if (changed + 60 * 1000 > Date.now()) {
      return
    }
    changed = Date.now()
    io.emit('imagechange', advanceImage())
  }, 1000)
}

exports.startServer = () => {
  const server = http.createServer(function (req, res) {
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
        serveImage(url, res)
        break
      default:
        res.statusCode = 404
        res.end('NOT FOUND')
    }
  })
  doWebSocket(server)
  server.listen(3030)
  return Promise.resolve()
}
