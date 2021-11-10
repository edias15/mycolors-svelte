const { IpcRender } = require('electron-ipc-render')
const ipc = new IpcRender()

ipc.on('get-data', (event, arg) => {
  event.sender.send('get-data-reply', {
    data: 'Hello from main process!'
  })
  console.log('get-data ----> ', arg)
})
