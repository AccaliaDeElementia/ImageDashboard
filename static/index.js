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
socket.on('imagechange', () => {
  const path = `/image?${Date.now()}`
  Array.prototype.forEach.apply(document.querySelectorAll('.image'), [img => {
    img.src = path
  }])
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
  fetchDisplayWeather(document.querySelector('.localweather'), 'http://pidashboard:8080/')
}
setInterval(getWeather, weatherRefresh)
getWeather()
