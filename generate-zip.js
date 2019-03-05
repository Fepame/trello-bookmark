const zipFolder = require('zip-folder');
 
zipFolder(
  './build/',
  './chrome.zip',
  err => {
    if(err) {
      console.log('oh no!', err)
    } else {
      console.log('ZIPped successfully')
    }
  }
)