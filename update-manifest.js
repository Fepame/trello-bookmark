const { version } = require('./package.json')
const manifest = require('./public/manifest.json')
const fs = require('fs')

fs.writeFile(
  './public/manifest.json',
  JSON.stringify({
    ...manifest,
    version
  },
  null,
  4
), err => {
    if (err) {
      console.error(err)
    } else {
      console.log('Version updated');
    }
})