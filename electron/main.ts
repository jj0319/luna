import { app, BrowserWindow, ipcMain, dialog, shell } from "electron"
import * as path from "path"
import * as fs from "fs"
import * as url from "url"
import { ENV, APP_INFO } from "../config/env"
import ElectronStore from "electron-store"

// 개발 환경 여부 확인
const isDev = process.env.NODE_ENV === "development"
const store = new ElectronStore()

// 메인 윈도우 참조 유지
let mainWindow: BrowserWindow | null = null

// 윈도우 생성 함수
function createWindow() {
  // 브라우저 윈도우 생성
  mainWindow = new BrowserWindow({
    width: ENV.WINDOW.WIDTH,
    height: ENV.WINDOW.HEIGHT,
    minWidth: ENV.WINDOW.MIN_WIDTH,
    minHeight: ENV.WINDOW.MIN_HEIGHT,
    title: ENV.WINDOW.TITLE,
    icon: path.join(__dirname, "..", ENV.WINDOW.ICON),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
    show: false, // 준비될 때까지 표시하지 않음
  })

  // 로딩 화면 표시
  mainWindow.once("ready-to-show", () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })

  // 개발 환경에서는 개발 서버 URL 사용, 프로덕션에서는 빌드된 앱 사용
  const startUrl = isDev
    ? "http://localhost:3000/desktop"
    : url.format({
        pathname: path.join(__dirname, "../app/desktop/index.html"),
        protocol: "file:",
        slashes: true,
      })

  // URL 로드
  mainWindow.loadURL(startUrl)

  // 개발 환경에서는 개발자 도구 열기
  if (isDev) {
    mainWindow.webContents.openDevTools()
  }

  // 윈도우가 닫힐 때 이벤트
  mainWindow.on("closed", () => {
    mainWindow = null
  })

  // 외부 링크는 기본 브라우저에서 열기
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url)
    return { action: "deny" }
  })
}

// 앱이 준비되면 윈도우 생성
app.whenReady().then(() => {
  createWindow()

  // macOS에서는 앱이 활성화될 때 윈도우가 없으면 새로 생성
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

// 모든 윈도우가 닫히면 앱 종료 (Windows/Linux)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

// IPC 핸들러 설정
ipcMain.handle("get-env-variable", (_, key) => {
  return ENV[key as keyof typeof ENV] || null
})

ipcMain.handle("get-app-info", () => {
  return APP_INFO
})

// 파일 시스템 관련 IPC 핸들러
ipcMain.handle("save-file", async (_, { content, defaultPath, filters }) => {
  if (!mainWindow) return { canceled: true }

  const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
    defaultPath,
    filters,
  })

  if (!canceled && filePath) {
    fs.writeFileSync(filePath, content)
    return { success: true, filePath }
  }

  return { canceled: true }
})

ipcMain.handle("open-file", async (_, { filters }) => {
  if (!mainWindow) return { canceled: true }

  const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
    properties: ["openFile"],
    filters,
  })

  if (!canceled && filePaths.length > 0) {
    const content = fs.readFileSync(filePaths[0], "utf8")
    return { success: true, content, filePath: filePaths[0] }
  }

  return { canceled: true }
})

// 로컬 스토리지 관련 IPC 핸들러
ipcMain.handle("store-get", (_, key) => {
  return store.get(key)
})

ipcMain.handle("store-set", (_, key, value) => {
  store.set(key, value)
  return true
})

ipcMain.handle("store-delete", (_, key) => {
  store.delete(key)
  return true
})

ipcMain.handle("store-clear", () => {
  store.clear()
  return true
})
