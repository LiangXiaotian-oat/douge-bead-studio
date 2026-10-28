# 豆格拼豆工作台 · Windows 离线版

适用于 Windows 11 64 位。下载压缩包后，先将整个压缩包解压到普通文件夹，双击文件夹中的“豆格.exe”启动；不需要安装 Python、Node.js，也不需要登录或启动服务器。请保留程序文件夹中的所有文件，不要只复制 exe。

图片转换、裁剪、色板、画笔、颜色统计、PNG/SVG/CSV 导出和项目保存均可离线使用。打印使用 Windows 系统打印窗口，可选择系统中已安装的 Microsoft Print to PDF；可选的 AI 图片优化需要联网以及用户自己的兼容服务和密钥。图片与自定义色卡默认在本机处理。原图不会保存在项目文件中；重新生成时需要再次上传。

色号为参考映射，实际颜色请以实物为准。大图 PNG 为整体预览，逐格色号建议导出 SVG。单边最多 2000 格、总计最多 100 万格。

直接删除解压后的程序文件夹即可移除软件。您自己导出的图纸和项目文件应另行保管。

## 源代码和许可证

程序界面中的“下载源代码”提供桌面封装与工作台源代码；解压目录中的 `resources/app/` 也包含源码。色板来自 [Zippland/perler-beads](https://github.com/Zippland/perler-beads)，项目遵循 AGPL-3.0，许可证见 `resources/app/LICENSE.txt`。Electron 与 Chromium 的许可证在程序目录下。

## 构建

安装 Node.js 和 Python Pillow，在本目录运行 `python sync_web.py`、`npm ci` 和 `node node_modules/electron/install.js`，然后运行 `python build.py`。生成结果位于 `release/`。
