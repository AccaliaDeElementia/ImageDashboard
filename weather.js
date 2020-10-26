'use sanity'

const { request } = require('https')

const appid = process.env.OPENWEATHER_APPID
const location = encodeURIComponent(process.env.OPENWEATHER_LOCATION || 'London, UK')

const getWeather = () => new Promise((resolve, reject) => {
  if (!appid) {
    return reject(new Error('no Openweather AppId Defined'))
  }
  let data = ''
  const req = request(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${appid}`, (res) => {
    res.on('data', (d) => {
      data += d
    })
    res.on('end', () => {
      resolve(JSON.parse(data))
    })
  })

  req.on('error', (e) => {
    console.error(e)
    reject(e)
  })
  req.end()
})

const weather = {
  temp: undefined,
  pressure: undefined,
  humidity: undefined,
  description: undefined,
  icon: undefined
}
const doWeather = () => getWeather()
  .then(data => {
    weather.temp = data.main.temp - 273.15
    weather.pressure = data.main.pressure
    weather.humidity = data.main.humidity
    weather.description = (data.weather[0] || {}).main
    weather.icon = (data.weather[0] || {}).icon
    return weather
  }, () => {
    Object.keys(weather).forEach(key => {
      weather[key] = undefined
    })
    return weather
  })

exports.updateWeather = doWeather

exports.getWeather = () => weather
