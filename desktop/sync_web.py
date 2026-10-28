"""Prepare the Electron renderer from the canonical web application."""
from pathlib import Path
import shutil

root = Path(__file__).resolve().parent
web = root.parent / 'web'
target = root / 'app'
target.mkdir(exist_ok=True)
for name in ['index.html', 'app.js', 'style.css', 'colors.json', 'LICENSE.txt']:
    shutil.copyfile(web / name, target / name)
shutil.copyfile(root / 'README.md', target / 'README.txt')

css = target / 'style.css'
lines = css.read_text(encoding='utf-8').splitlines()
css.write_text('\n'.join(line for line in lines if not line.startswith('@import url(')) + '\n', encoding='utf-8')

js = target / 'app.js'
text = js.read_text(encoding='utf-8')
start = text.index("$('print').onclick=()=>")
end = text.index("$('saveProject').onclick=", start)
desktop_print = "$('print').onclick=async()=>{try{let img=exportCanvas().toDataURL('image/png');let result=await window.desktopBridge.printPattern(img);if(!result.ok)setStatus('打印已取消或失败：'+(result.reason||''));}catch(e){setStatus('打印失败：'+e.message)}};"
js.write_text(text[:start] + desktop_print + text[end:], encoding='utf-8')

html = target / 'index.html'
text = html.read_text(encoding='utf-8').replace('https://github.com/LiangXiaotian-oat/douge-bead-studio', 'source.zip')
html.write_text(text, encoding='utf-8')
print('已同步网页源码到桌面应用。')
