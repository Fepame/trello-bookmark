export const isYouTube = url => url.includes('youtube.com/watch?v=')
export const getYoutubeVideoId = url => url.split('v=')[1]

export const getYoutubeCover = videoId => new Promise(
  resolve => {
    const img = new Image()
    img.crossOrigin = 'Anonymous'
    img.onload = function() {
      const canvas = document.createElement('CANVAS')
      const ctx = canvas.getContext('2d')
      canvas.height = this.naturalHeight
      canvas.width = this.naturalWidth
      ctx.drawImage(this, 0, 0)
      resolve(canvas.toDataURL('image/jpeg'))
    }
    img.src = `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    if (img.complete || img.complete === undefined) {
      img.src = "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw=="
      img.src = `http://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }
  }
)

