export const closeTab = () => isChromeExtension
  ? window.close() : window.location.reload(true)

export const isChromeExtension = window
  .location
  .protocol === 'chrome-extension:'


export const getTabInfo = cb => {
  const {chrome: { tabs }} = window
  tabs.query(
    { active: true, currentWindow: true },
    tabs => cb({
      link: tabs[0].url,
      title: tabs[0].title
    })
  )
}