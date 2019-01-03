const {app, BrowserWindow} = require('electron')
const windowStateKeeper = require('electron-window-state')

let window

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1024,
        defaultHeight: 768
    })

    window = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height
    })

    mainWindowState.manage(window)

    window.setMenu(null)

    window.loadURL('https://music.youtube.com')

    window.on('closed', () => {
        window = null
    })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    if(window === null) {
        createWindow()
    }
})