export const isChromeExtension = window
  .location
  .protocol === 'chrome-extension:'

export const closeTab = () => isChromeExtension && window.close()
   
export const getTabInfo = cb => {
  const {chrome: { tabs }} = window
  if(tabs) {
    tabs.query(
      { active: true, currentWindow: true },
      tabs => cb(tabs[0])
    )
  } else {
    cb({
      title: document.title,
      url: window.location.href
    })
  }
}