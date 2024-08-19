const { contextBridge, ipcRenderer } = require('electron')  

const API = {
    send: (channel, data) => {
        console.log(channel, data)
        ipcRenderer.send(channel, data)
    },
    receive: (channel, func) => {
        ipcRenderer.on(channel, (event, ...args) => func(...args))
        console.log(channel);
        console.log(args);
    },
    appData: {rows: []}
}

contextBridge.exposeInMainWorld('api', API)                                                                                                                                                

ipcRenderer.on('haList', (event, data) => {
    console.log('preload-haList: ', data )
    window.postMessage({type: 'haList', data: data})
})

ipcRenderer.on('gstSearch', (event, data) => {
    // console.log('preload-gstSearch: ', data )
    window.postMessage({type: 'rGstSearch', data: data})

})

ipcRenderer.on('gstDetail', (event, data) => {
    // console.log('preload-gstDetail: ', data )
    window.postMessage({type: 'gstDetail', data: data})

})

ipcRenderer.on('gstReserve', (event, data) => {
    // console.log('preload-gstReserve: ', data )
    window.postMessage({type: 'rGstReserve', data: data})

})

ipcRenderer.on('gstResDetail', (event, data) => {
    // console.log('preload-gstResDetail: ', data )
    window.postMessage({type: 'gstResDetail', data: data})

})

ipcRenderer.on('gstStays', (event, data) => {
    // console.log('preload-gstResDetail: ', data )
    window.postMessage({type: 'gstStays', data: data})

})

ipcRenderer.on('gstStayDetail', (event, data) => {
    // console.log('preload-gstStayDetail: ', data )
    window.postMessage({type: 'gstStayDetail', data: data})

})

