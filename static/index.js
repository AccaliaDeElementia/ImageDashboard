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

const getWeather = () => {
  const request = new XMLHttpRequest()
  request.open('GET', '/weather.json', true)
  request.onload = () => {
    if (request.status >= 200 && request.status < 400) {
      const weather = JSON.parse(request.responseText)
      const fmt = (d, suffix = '') => {
        if (d === undefined || d === null) {
          return ''
        } else if (typeof d === 'number') {
          return `${d.toFixed(0)}${suffix}`
        } else {
          return `${d}${suffix}`
        }
      }
      if (!weather.temp) {
        document.querySelector('.weather').style.display = 'none'
        return
      }
      document.querySelector('.weather').style.display = 'block'
      document.querySelector('.temp').innerHTML = fmt(weather.temp, '&deg;C')
      document.querySelector('.desctext').innerHTML = fmt(weather.description)
      document.querySelector('.icon').src = `https://openweathermap.org/img/w/${fmt(weather.icon)}.png`
    } else {
      document.querySelector('.weather').style.display = 'none'
    }
  }
  request.onerror = () => {
    document.querySelector('.weather').style.display = 'none'
  }
  request.send()
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
