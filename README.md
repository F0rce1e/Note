# GlimmarNote · 悬浮桌面记事本

GlimmarNote 是一个轻量级的桌面悬浮记事本小组件，适合用来快速记录灵感、待办、会议要点等。  
它以透明磨砂亚克力风格悬浮在桌面上，支持托盘隐藏、重新唤出和简单的个性化设置。

---

## 功能特性

- 透明悬浮窗口  
  无边框、可拖拽的小窗，默认不强制置顶，不会挡住日常办公软件。

- 便捷的文本记事  
  支持输入与保存笔记内容，重启应用后自动恢复上次内容。

- 个性化外观  
  - 调整窗口整体透明度  
  - 调整字体大小  
  - 切换“始终置顶”开关

- 后台常驻与托盘控制  
  - 运行时不占用 Windows 任务栏  
  - 通过系统托盘图标显示 / 隐藏窗口  
  - 托盘菜单中可以安全退出应用

- 跨平台（设计上支持）  
  使用 Electron + React 实现，理论上可构建 Windows / macOS / Linux 版本。

---

## 技术栈

- **Electron**：桌面应用壳，管理主进程窗口、托盘、置顶等系统能力  
- **Vite + React**：前端界面开发（设置面板、记事本 UI）  
- **CSS**：亚克力磨砂风格 UI 与基础布局  
- **localStorage**：本地记事数据与配置持久化

---

## 环境要求

- Node.js ≥ 18（建议使用 LTS 版本）  
- npm ≥ 8  
- 操作系统：Windows 10/11（当前主要开发和验证环境）

---

## 安装与运行

### 1. 克隆项目

```bash
git clone https://github.com/yourname/GlimmarNote.git
cd GlimmarNote
```

### 2. 安装依赖

```bash
npm install
```

### 3. 开发模式运行

启动 Vite 与 Electron 联动的开发环境：

```bash
npm run dev
```

执行后会：

- 启动 Vite 开发服务器（默认端口 `5173`）  
- 等待端口就绪后自动启动 Electron 并载入前端页面

### 4. 打包应用

使用 electron-builder 生成可运行包：

```bash
npm run build
```

打包结果默认输出到：

- `release/` 目录  
  - Windows：`release/win-unpacked/GlimmarNote.exe` 等文件

可根据 electron-builder 配置扩展 macOS / Linux 目标。

---

## 项目结构

当前主要目录结构如下（省略了一些构建产物）：

```text
GlimmarNote/
├─ src/
│  ├─ components/
│  │  └─ NoteApp.jsx        # React 记事本与设置面板 UI
│  ├─ styles/
│  │  ├─ index.css          # 全局样式（透明背景等）
│  │  └─ NoteApp.css        # 记事本亚克力 UI 样式
│  ├─ App.jsx               # React 根组件
│  ├─ main.jsx              # Vite 前端入口（挂载 React）
│  ├─ main.js               # Electron 主进程，窗口 & 托盘逻辑
│  └─ preload.js            # 预加载脚本（可扩展安全桥接）
│
├─ dist/                    # Vite 构建产物（前端静态资源）
├─ release/                 # electron-builder 打包产物
├─ index.html               # Vite HTML 模板
├─ package.json             # 项目配置与脚本
├─ vite.config.js           # Vite 配置
└─ README.md                # 项目说明文档（当前文件）
```

---

## 使用说明

### 窗口行为

- **拖拽窗口**  
  顶部窄条区域为可拖拽区，可用来移动悬浮窗位置。

- **后台常驻**  
  点击窗口关闭按钮（或关闭所有窗口）后，应用不会立即退出，而是隐藏到系统托盘中。

- **托盘控制**  
  - 单击托盘图标：显示 / 隐藏主窗口  
  - 右键菜单：  
    - “显示/隐藏”：切换窗口可见性  
    - “退出”：完全退出 GlimmarNote

### 设置面板

通过右上角的齿轮按钮打开设置：

- **透明度**：调节整个窗口的透明程度  
- **字体大小**：调节记事文本区域的字体大小  
- **始终置顶**：  
  - 开启：窗口将悬浮于其他应用之上  
  - 关闭：窗口行为类似普通应用，不主动遮挡其他软件  

所有设置（透明度、字体大小、置顶开关、笔记内容）都会保存在本地，下次启动时自动恢复。

---

## 开发说明

- 主进程文件：[`src/main.js`](file:///g:/Projrct/GlimmarNote/src/main.js)  
  - 创建窗口、托盘图标  
  - 通过 `ipcMain.handle('set-always-on-top', ...)` 响应前端置顶开关

- 前端入口：[`src/main.jsx`](file:///g:/Projrct/GlimmarNote/src/main.jsx)  
  - 使用 React 进行组件挂载

- 记事本组件：[`src/components/NoteApp.jsx`](file:///g:/Projrct/GlimmarNote/src/components/NoteApp.jsx)  
  - 文本输入、localStorage 持久化  
  - 透明度 / 字体大小 / 始终置顶 设置  
  - 通过 `ipcRenderer.invoke('set-always-on-top')` 与主进程通信

如需继续扩展：

- 可以在主进程中增加更多系统级能力（全局快捷键、开机自启等）  
- 前端可以增加多笔记切换、标签、Markdown 支持等功能

---

## 脚本命令

在项目根目录执行：

- `npm run dev`  
  启动 Vite + Electron 开发环境。

- `npm run build`  
  构建前端并使用 electron-builder 打包桌面应用。

---

## 开源协议

目前示例中未绑定具体协议，你可以根据自己的实际情况选择：

- 完全闭源自用  
- 或采用常见开源协议（如 MIT / Apache-2.0 等）并在根目录添加 `LICENSE` 文件

如计划开源到 GitHub，建议：

- 填写 `package.json` 中的 `author`、`license` 字段  
- 在本文件中补充项目主页、截图与更新日志等信息

