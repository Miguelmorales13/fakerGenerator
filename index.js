const { app, BrowserWindow } = require("electron");

let win;
function createWindow() {
    // Crea la ventana del navegador.
    win = new BrowserWindow({
        width: 700,
        height: 400,
        webPreferences: {
            nodeIntegration: true
        },
        frame: false,
        titleBarStyle: "customButtonsOnHover"
    });

    // y carga el  index.html de la aplicación.
    win.loadFile("index.html");
    win.on("closed", () => {
        win = null;
    });
}

app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
app.on("activate", () => {
    if (win === null) {
        createWindow();
    }
});
