// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { IpcRenderer, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('api', {
    theme: () => ipcRenderer.invoke('theme'),
    msgbox: () => ipcRenderer.invoke('msgbox')
});