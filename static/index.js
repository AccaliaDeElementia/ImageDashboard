'use sanity'

const DayOfWeek = (date) => {
  return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
}

const Month = (date) => {
  return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'][date.getMonth()]
}

let nextCycle = Date.now() + 2 * 60 * 1000
const cycleImage = () => {
  nextCycle = Date.now() + 2 * 60 * 1000
  const path = `/image?${Date.now()}`
  Array.prototype.forEach.apply(document.querySelectorAll('.image'), [img => {
    img.src = path
  }])
}

const updateTime = () => {
  const now = new Date()
  document.querySelector('.time').innerHTML = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}`
  document.querySelector('.date').innerHTML = `${DayOfWeek(now)}, ${Month(now)} ${now.getDate()}`
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
          return `${d.toPrecision(1)}${suffix}`
        } else {
          return `${d}${suffix}`
        }
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
updateTime()
getWeather()
setInterval(() => {
  updateTime()
  if (Date.now() >= nextCycle) {
    cycleImage()
  }
}, 1000)
setInterval(getWeather, 10 * 60 * 1000)
