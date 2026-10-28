'use strict';
const { app, BrowserWindow, protocol, session, dialog, shell, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');

protocol.registerSchemesAsPrivileged([{scheme:'douge',privileges:{standard:true,secure:true,supportFetchAPI:true,corsEnabled:true}}]);
const assets = new Map([
  ['/index.html','text/html; charset=utf-8'],['/app.js','application/javascript; charset=utf-8'],
  ['/style.css','text/css; charset=utf-8'],['/colors.json','application/json; charset=utf-8'],
  ['/LICENSE.txt','text/plain; charset=utf-8'],['/README.txt','text/plain; charset=utf-8'],
  ['/source.zip','application/zip'],['/icon.png','image/png']
]);
let mainWindow;
function createWindow(){
  mainWindow = new BrowserWindow({width:1480,height:960,minWidth:780,minHeight:600,show:false,backgroundColor:'#f8f7f3',title:'豆格 · 拼豆图纸工作台',icon:path.join(__dirname,'icon.png'),webPreferences:{preload:path.join(__dirname,'preload.cjs'),contextIsolation:true,nodeIntegration:false,sandbox:true}});
  mainWindow.once('ready-to-show',()=>mainWindow.show());
  mainWindow.webContents.setWindowOpenHandler(({url})=>{
    if(url==='about:blank') return {action:'allow',overrideBrowserWindowOptions:{show:false,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}}};
    if(/^https?:\/\//i.test(url)) shell.openExternal(url);
    return {action:'deny'};
  });
  mainWindow.webContents.on('will-navigate',(event,url)=>{if(!url.startsWith('douge://app/')){event.preventDefault();if(/^https?:\/\//i.test(url))shell.openExternal(url)}});
  mainWindow.loadURL('douge://app/index.html');
}
app.whenReady().then(()=>{
  protocol.handle('douge',async request=>{
    const url=new URL(request.url),file=url.pathname==='/'?'/index.html':url.pathname,type=assets.get(file);
    if(url.hostname!=='app'||!type)return new Response('Not found',{status:404});
    try{return new Response(await fs.readFile(path.join(__dirname,file.slice(1))),{headers:{'Content-Type':type,'Cache-Control':'no-store'}})}catch{return new Response('Not found',{status:404})}
  });
  session.defaultSession.on('will-download',(event,item)=>{
    const filename=path.basename(item.getFilename());
    const savePath=dialog.showSaveDialogSync(mainWindow,{title:'保存文件',defaultPath:path.join(app.getPath('downloads'),filename)});
    if(!savePath){item.cancel();return}item.setSavePath(savePath);
  });
  ipcMain.handle('print-pattern',async(event,data)=>{
    if(!mainWindow||event.sender!==mainWindow.webContents||typeof data!=='string'||!/^data:image\/png;base64,[A-Za-z0-9+/=]+$/.test(data)||data.length>50000000)throw new Error('图纸数据无效或过大');
    const printWindow=new BrowserWindow({show:false,parent:mainWindow,webPreferences:{contextIsolation:true,nodeIntegration:false,sandbox:true}});
    try{
      await printWindow.loadURL('data:text/html;charset=utf-8,'+encodeURIComponent('<!doctype html><html><head><title>豆格图纸</title><style>body{margin:0}img{width:100%;height:auto}</style></head><body><img src="'+data+'"></body></html>'));
      return await new Promise(resolve=>printWindow.webContents.print({silent:false,printBackground:true},(ok,reason)=>resolve({ok,reason})));
    }finally{if(!printWindow.isDestroyed())printWindow.destroy()}
  });
  createWindow();
  app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow()});
});
app.on('window-all-closed',()=>app.quit());
