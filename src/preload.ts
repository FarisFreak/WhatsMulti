// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRenderer, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('api', {
    theme: () => ipcRenderer.invoke('theme'),
    msgbox: () => ipcRenderer.invoke('msgbox'),
    onNativeThemeChanged: (callback: () => void) => ipcRenderer.on("nativeThemeChanged", callback),
    themeShouldUseDarkColors: () => ipcRenderer.sendSync("themeShouldUseDarkColors"),
});

contextBridge.exposeInMainWorld('electron', {
    tabs: {
        get() {
            return ipcRenderer.sendSync('electron-store-get', 'tabs');
        },
        set(val: any){
            ipcRenderer.send('electron-store-set', val);
        },
        // has(key: string){
        //     ipcRenderer.send('electron-store-has', key);
        // }
    }
})