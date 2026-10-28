from pathlib import Path
import argparse, shutil, zipfile
from PIL import Image, ImageDraw

root=Path(__file__).resolve().parent
app=root/'app'
parser=argparse.ArgumentParser()
parser.add_argument('--output',default='release',help='输出目录（默认 release）')
release=(root/parser.parse_args().output).resolve()
runtime=root/'node_modules'/'electron'/'dist'
if not (runtime/'electron.exe').exists():
    raise SystemExit('Electron runtime missing; run node node_modules/electron/install.js')

icon=Image.new('RGBA',(256,256),(248,247,243,255))
d=ImageDraw.Draw(icon)
for box,color in [((25,25,120,120),'#8f7ee0'),((136,25,231,120),'#e9a4a4'),((25,136,120,231),'#f1c976'),((136,136,231,231),'#9cccb4')]:
    d.rounded_rectangle(box, radius=30,fill=color)
icon.save(app/'icon.png')
icon.save(app/'icon.ico',format='ICO',sizes=[(16,16),(24,24),(32,32),(48,48),(64,64),(128,128),(256,256)])

source=app/'source.zip'
source_members=['main.cjs','preload.cjs','package.json','index.html','app.js','style.css','colors.json','LICENSE.txt','README.txt','icon.png','icon.ico']
with zipfile.ZipFile(source,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for filename in source_members:z.write(app/filename,'desktop/app/'+filename)
    for filename in ['README.md','package.json','package-lock.json','build.py','sync_web.py']:z.write(root/filename,'desktop/'+filename)
    for filename in ['index.html','app.js','style.css','colors.json','LICENSE.txt']:z.write(root.parent/'web'/filename,'web/'+filename)
    for filename in ['README.md','README.en.md','CONTRIBUTING.md','AUTHORS.md','LICENSE','package.json','.gitignore']:
        z.write(root.parent/filename,filename)
    for directory in ['docs','tests','.github']:
        for file in (root.parent/directory).rglob('*'):
            if file.is_file():z.write(file,file.relative_to(root.parent))

release.mkdir(exist_ok=True)
folder=release/'豆格离线版'
if folder.exists():
    raise SystemExit('发布目录已存在，请使用新的 release 目录以避免覆盖已有文件。')
shutil.copytree(runtime,folder)
shutil.copytree(app,folder/'resources'/'app')
(folder/'electron.exe').rename(folder/'豆格.exe')
shutil.copyfile(root/'README.md',folder/'使用说明.txt')
archive=release/'豆格-Windows11-离线版.zip'
if archive.exists():raise SystemExit('发布压缩包已存在，请先另存或移走。')
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for file in folder.rglob('*'):
        if file.is_file():z.write(file,file.relative_to(release))
print(f'Package: {archive} ({archive.stat().st_size//1024//1024} MiB)')
