'use sanity'
/* global io */

const timeRefresh = 1000
const weatherRefresh = 10 * 60 * 1000

const socket = io()
let id = null
socket.on('id', (newid) => {
  if (id === null) {
    id = newid
  } else if (id !== newid) {
    location.reload()
  }
})
socket.on('imagechange', (index) => {
  const path = `/image?${index}`
  Array.prototype.forEach.apply(document.querySelectorAll('.image'), [img => {
    img.src = path
  }])
})

document.addEventListener('keyup', (evt) => {
  const keys = {
    ARROWRIGHT: () => socket.emit('nextimage'),
    ARROWLEFT: () => socket.emit('backimage')
  }
  var key = (evt.ctrlKey ? '<CTRL>' : '') +
      (evt.altKey ? '<ALT>' : '') +
      (evt.shiftKey ? '<SHIFT>' : '') +
      evt.key.toUpperCase()
  const action = keys[key] || (() => true)
  action()
})

const initialScale = window.visualViewport ? window.visualViewport.scale : 1
document.addEventListener('click', (evt) => {
  if (window.visualViewport && window.visualViewport.scale > initialScale) {
    return
  }
  const pageWidth = window.innerWidth || document.body.clientWidth
  const x = evt.pageX
  if (x < pageWidth / 3) {
    socket.emit('backimage')
  } else if (x < pageWidth * 2 / 3) {
    // pass
  } else {
    socket.emit('nextimage')
  }
})

const updateTime = () => {
  const now = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  document.querySelector('.time').innerHTML = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}`
  document.querySelector('.date').innerHTML = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`
}
updateTime()
setInterval(() => {
  updateTime()
}, timeRefresh)

const fetchDisplayWeather = (node, url) => {
  const request = new XMLHttpRequest()
  request.open('GET', url, true)
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const weather = JSON.parse(request.responseText)
      const fmt = (d, suffix = '') => {
        if (d === undefined || d === null) {
          return ''
        } else if (typeof d === 'number') {
          return `${d.toFixed(1)}${suffix}`
        } else {
          return `${d}${suffix}`
        }
      }
      const show = (field, text) => {
        if (!text) {
          field.style.display = 'none'
          return
        }
        field.style.display = 'flex'
      }
      show(node, weather.temp)
      node.querySelector('.temp').innerHTML = fmt(weather.temp, '&deg;C')
      show(node.querySelector('.desc'), weather.description)
      node.querySelector('.desctext').innerHTML = fmt(weather.description)
      node.querySelector('.icon').src = `https://openweathermap.org/img/w/${fmt(weather.icon)}.png`
    } else {
      node.style.display = 'none'
    }
  }
  request.onerror = () => {
    node.style.display = 'none'
  }
  request.send()
}

const getWeather = () => {
  fetchDisplayWeather(document.querySelector('.weather'), '/weather.json')
  fetchDisplayWeather(document.querySelector('.localweather'), 'http://localhost:8080/')
}
setInterval(getWeather, weatherRefresh)
getWeather()
