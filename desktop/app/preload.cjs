'use strict';
const {contextBridge,ipcRenderer}=require('electron');
contextBridge.exposeInMainWorld('desktopBridge',{printPattern:data=>ipcRenderer.invoke('print-pattern',data)});
