const { version } = require('../package.json')
const manifest = require('../public/manifest.json')
const fs = require('fs')

fs.writeFile(
  './public/manifest.json',
  JSON.stringify(
    {
      ...manifest,
      icons: [{
        "src": "icon128.png",
        "sizes": "128x128",
        "type": "image/png"
      }],
      version
    },
    null,
    4
  ), err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Manifest version taken from package.json')
    }
})