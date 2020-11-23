'use sanity'

const timeRefresh = 1000
const imageRefresh = 1 * 60 * 1000
const weatherRefresh = 10 * 60 * 1000

let nextCycle = Date.now() + imageRefresh
const cycleImage = () => {
  nextCycle = Date.now() + imageRefresh
  const path = `/image?${Date.now()}`
  Array.prototype.forEach.apply(document.querySelectorAll('.image'), [img => {
    img.src = path
  }])
}

const updateTime = () => {
  const now = new Date()
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  document.querySelector('.time').innerHTML = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}`
  document.querySelector('.date').innerHTML = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`
}

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
      if (!weather.temp) {
        document.querySelector('.weather').style.display = 'none'
        return
      }
      node.style.display = 'block'
      node.querySelector('.temp').innerHTML = fmt(weather.temp, '&deg;C')
      if (!weather.description) {
        node.querySelector('.desc').style.display = 'none'
        return
      }
      node.querySelector('.desc').style.display = 'block'
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

document.body.addEventListener('click', cycleImage)
document.body.addEventListener('keydown', cycleImage)
updateTime()
getWeather()
setInterval(() => {
  updateTime()
  if (Date.now() >= nextCycle) {
    cycleImage()
  }
}, timeRefresh)
setInterval(getWeather, weatherRefresh)
