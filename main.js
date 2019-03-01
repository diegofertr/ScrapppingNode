const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs')

axios.get('https://www.ultracasas.com/bo/site-search/inmueble/departamento-en-anticretico--en--sopocachi--la-paz---la-paz?idCiudadUrl=5067&aTiposInmueble%5B%5D=Departamento&aTiposOferta%5B%5D=Anticretico&idCiudad=5067&IdZonaFive%5B%5D=47&precioMin=M%C3%ADnimo&precioMax=M%C3%A1ximo&listType=list&filter=RECIENTES&mp=&page=1')
  .then(response => {
    const $ = cheerio.load(response.data)
    const items = $('.inmuebles .inmuebles-item').toArray()
      .map(item => {
        // cada item es un elemento del dom
        const $item = $(item)
        let arrayb = $item.find(".inmuebles-item-precio ul:contains('m2')").text().split("\n")
        return {
          title: $item.find('.inmuebles-item-titular').find('.line-height-30px').text(),
          link: $item.find('.inmuebles-item-titular').find('.cursor-pointer').attr('href'),
          price: $item.find(".inmuebles-item-precio h4:contains('$us.')").text(),
          details: [arrayb[1], arrayb[2], arrayb[3]]
        }
      })
    //debugger
    return items
  })
  .then(items => {
    fs.writeFile('./items.json', JSON.stringify(items), function (err) {
      if (err) return console.log(err)

      console.log('items saved! :D')
    })
  })