require('dotenv').config()
const zipFolder = require('zip-folder')
const fs = require('fs')

const webStore = require('chrome-webstore-upload')({
  extensionId: 'ephoopolmejjnjkbbdcfgoohokhnekca',
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  refreshToken: process.env.REFRESH_TOKEN 
})

zipFolder(
  './build/',
  './chrome.zip',
  err => {
    if(err) {
      console.log('oh no!', err)
    } else {
      console.log('ZIPped successfully')
      const myZipFile = fs.createReadStream('./chrome.zip');
      webStore.fetchToken().then(token => {
        webStore.uploadExisting(myZipFile, token).then(() => {
          console.log("Uploaded successfully")
          webStore.publish('default', token).then(res => {
            console.log(res)
          }).catch( e => console.log(e) )
        })
      })
    }
  }
)
