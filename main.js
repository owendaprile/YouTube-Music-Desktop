const {app, BrowserWindow, Menu, Tray} = require('electron')
const windowStateKeeper = require('electron-window-state')
var path = require('path')

let window
let isQuitting
let isPlaying
let tray = null

const trayMenu = [
    {label: 'Play/Pause', click: () => {
        window.webContents.executeJavaScript('document.getElementById("play-pause-button").click()')
    }},
    {label: 'Exit', click: () => {
        isQuitting = true
        tray.destroy()
        app.quit()
    }},
]

function createWindow() {
    let mainWindowState = windowStateKeeper({
        defaultWidth: 1024,
        defaultHeight: 768
    })

    window = new BrowserWindow({
        'x': mainWindowState.x,
        'y': mainWindowState.y,
        'width': mainWindowState.width,
        'height': mainWindowState.height,
        'icon': path.join(__dirname, 'assets/icons/win/96x96.ico'),
        'title': 'YouTube Music'
    })

    tray = new Tray(path.join(__dirname, 'assets/icons/win/32x32.ico'))
    const contextMenu = Menu.buildFromTemplate(trayMenu)

    tray.setToolTip('YouTube Music')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        if(!window.isVisible()) {
            window.show()
        }
    })

    mainWindowState.manage(window)

    window.setMenu(null)

    window.loadURL('https://music.youtube.com')

    window.webContents.openDevTools()

    window.on('closed', () => {
        window = null
    })

    window.on('close', function(event) {
        if(!isQuitting) {
            event.preventDefault()
            window.hide()
        }
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