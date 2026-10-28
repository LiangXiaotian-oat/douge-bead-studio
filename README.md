<div align="center">

# 豆格 · Douge Bead Studio

**把喜欢的，拼出来。**  图片转换、拼豆图纸精修与材料统计，一站完成。

[![License: AGPL-3.0](https://img.shields.io/badge/license-AGPL--3.0-blue.svg)](LICENSE)
[![Tests](https://github.com/LiangXiaotian-oat/douge-bead-studio/actions/workflows/ci.yml/badge.svg)](https://github.com/LiangXiaotian-oat/douge-bead-studio/actions/workflows/ci.yml)
[![Windows 11](https://img.shields.io/badge/Windows%2011-x64-6c7dc7)](https://github.com/LiangXiaotian-oat/douge-bead-studio/releases/latest)

[在线使用](https://pindou-studio-creative.lushchime20.chatgpt.site/) · [下载 Windows 离线版](https://github.com/LiangXiaotian-oat/douge-bead-studio/releases/latest) · [English](README.en.md) · [反馈问题](https://github.com/LiangXiaotian-oat/douge-bead-studio/issues)

![豆格工作台示例](docs/workspace.png)

</div>

## 能做什么

- **图片转图纸**：上传图片，预览原图并通过拖动或像素坐标裁剪；可设置网格、色数、边缘去背景和抖动。
- **拼豆色卡**：MARD 221 色基础套装与 291 色全套，另有 COCO、漫漫、盼盼和咪小窝的参考色号映射；支持导入自定义 CSV 色卡。
- **逐格编辑**：画笔、橡皮、填充、吸色、撤销与重做，自动统计各颜色用量。
- **导出与续做**：导出 PNG、SVG、CSV、可再次打开的项目文件，以及打印 / PDF。
- **本地处理**：基础转换在浏览器或 Windows 客户端本机运行，无需注册。可选的 AI 图片优化需要自行配置兼容接口，图片与密钥会发送至所选服务。

单边最多 **2,000 格**，总计最多 **100 万格**。大尺寸 PNG 是整体预览，逐格色号建议使用 SVG。内置的跨品牌色号是参考映射而非厂家官方色卡；不同品牌、批次可能有色差。

## 快速开始

### 在线使用

打开 [豆格在线工作台](https://pindou-studio-creative.lushchime20.chatgpt.site/)，上传图片 → 裁剪 → 选择尺寸和色卡 → 生成 → 精修和导出。

### Windows 11 离线版

在 [Releases](https://github.com/LiangXiaotian-oat/douge-bead-studio/releases/latest) 下载 Windows x64 压缩包，**解压整个文件夹**，双击 `豆格.exe`。无需安装 Python、Node.js 或登录。可通过 Windows 打印窗口选择已安装的 PDF 打印机。离线版未进行代码签名，Windows 可能提示发布者未知。

### 本地运行网页版

需要 Python 3；项目无需安装前端依赖：

```bash
git clone https://github.com/LiangXiaotian-oat/douge-bead-studio.git
cd douge-bead-studio
python -m http.server 4173 --directory web
```

浏览器访问 <http://localhost:4173/>。请通过本地服务器打开，以便加载色卡。

### 从源码构建 Windows 离线包

需要 Windows x64、Node.js、Python 和 Pillow。首次构建需要联网下载 Electron；生成的应用基础功能可离线运行。

```powershell
python -m pip install Pillow
cd desktop
python sync_web.py
npm ci
node node_modules/electron/install.js
python build.py
```

结果在 `desktop/release/`。脚本会保留现有发布目录，避免覆盖文件。桌面界面从 `web/` 同步，修改网页后重新执行 `sync_web.py`。

## 自定义色卡

展开“导入自定义品牌色卡”，粘贴或上传 UTF-8 CSV。每行一个色号和 HEX 色值，支持 1–500 色；色号和 HEX 不能重复。

```csv
色号,HEX
A01,#FAF4C8
A02,#FFFFD5
```

点击“应用自定义色卡”后重新生成图纸。自定义色卡会随项目文件保存；**项目文件不包含原图**，需要重新生成时请再次上传图片。

## 开发与贡献

```bash
npm test
```

仓库结构：`web/` 是在线版和共享图像处理代码；`desktop/` 是 Electron 容器与 Windows 打包脚本；`tests/` 包含色卡、裁剪和尺寸边界测试。欢迎提交问题与改进；请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md)。

## 致谢与许可

色板映射数据来自 [Zippland/perler-beads](https://github.com/Zippland/perler-beads)，感谢原作者及贡献者。本项目遵循 [AGPL-3.0](LICENSE)；Electron 和 Chromium 的许可随 Windows 离线包分发。品牌、产品名及色号归其各自权利人所有。
