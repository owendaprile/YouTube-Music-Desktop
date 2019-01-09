const {app, BrowserWindow, Menu, Tray, globalShortcut} = require('electron')
const windowStateKeeper = require('electron-window-state')
var path = require('path')

let window = null
let isQuitting
let isPlaying
let tray = null

const hasSingleInstanceLock = app.requestSingleInstanceLock()

const trayMenu = [
    {label: 'Controls', enabled: false},

    {label: 'Previous', click: () => {
        window.webContents.executeJavaScript('document.querySelector(\'.previous-button\').click()')
    }},
    {label: 'Play/Pause', click: () => {
        window.webContents.executeJavaScript('document.querySelector(\'.play-pause-button\').click()')
    }},
    {label: 'Next', click: () => {
        window.webContents.executeJavaScript('document.querySelector(\'.next-button\').click()')
    }},
    {label: 'Like', click: () => {
        window.webContents.executeJavaScript('document.querySelector(\'ytmusic-player-bar .like\').click()')
    }},
    {label: 'Dislike', click: () => {
        window.webContents.executeJavaScript('document.querySelector(\'ytmusic-player-bar .dislike\').click()');
    }},
    {type: 'separator'},
    {label: 'Exit', click: () => {
        isQuitting = true
        tray.destroy()
        app.quit()
    }}
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
        'icon': path.join(__dirname, '\\..\\assets\\icons\\win\\96x96.ico'),
        'title': 'YouTube Music'
    })

    tray = new Tray(path.join(__dirname, '\\..\\assets\\icons\\win\\32x32.ico'))
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

    globalShortcut.register('MediaPreviousTrack', () => {
        window.webContents.executeJavaScript('document.querySelector(\'.previous-button\').click()')
    })

    globalShortcut.register('MediaPlayPause', () => {
        window.webContents.executeJavaScript('document.querySelector(\'.play-pause-button\').click()')
    })

    globalShortcut.register('MediaNextTrack', () => {
        window.webContents.executeJavaScript('document.querySelector(\'.next-button\').click()')
    })

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

if(!hasSingleInstanceLock) {
    isQuitting = true
    app.quit()
} else {
    app.on('second-instance', (event, commandLine, workingDirectory) => {
        if(window) {
            if(!window.isVisible()) {
                window.show()
            }
            if(window.isMinimized()) {
                window.restore()
            }
            window.focus()
        }
    })
    app.on('ready', createWindow)
}

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