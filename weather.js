const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

const urlWeather = 'https://www.accuweather.com/es/bo/la-paz/33655/current-weather/33655'

axios.get(urlWeather)
  .then(response => {
    const $ = cheerio.load(response.data)
    const items = $('#detail-now').toArray()
      .map(item => {
        const $item = $(item)
        return {
          temperatura: $item.find('.forecast .info .temp .large-temp').text(),
          condicion: $item.find('.forecast .info .cond').text(),
          humedad: $item.find(".more-info .stats li:contains('Humedad')").find('strong').text(),
          presion: $item.find(".more-info .stats li:contains('Presión')").find('strong').text(),
          indiceUV: $item.find(".more-info .stats li:contains('UV')").find('strong').text(),
          nubosidad: $item.find(".more-info .stats li:contains('Nubosidad')").find('strong').text()
        }
      })
    // debugger
    return items
  })
  .then(items => {
    fs.writeFile('./weather.json', JSON.stringify(items[0], function (err) {
      if (err) return console.log(err)

      console.log('Datos del clima salvados! :D')
    }))
  })