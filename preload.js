const electron = require('electron')
const electronStore = require('electron-store')
const { sockets, setMainWindow } = require('./server')

setMainWindow(electron.remote.getCurrentWindow())

electron.ipcRenderer.on('socketResponse', (event, data) =>
  window.wallet.socketResponse(data)
)

window.sockets = sockets
window.wallet = {
  // Placeholder function. Will be rewrite in page script.
  socketResponse: () => {
    console.log('哈哈哈哈哈哈')
  }
}

window.ElectronStore = function(...args) {
  return new electronStore(...args)
}

window.accountStore = new window.ElectronStore({
  name: 'accounts',
  defaults: {}
})
window.nodeStore = new window.ElectronStore({ name: 'nodes', defaults: {} })
window.settingStore = new window.ElectronStore({
  name: 'settings',
  default: {}
})