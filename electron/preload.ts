import { contextBridge, ipcRenderer } from "electron"

// 렌더러 프로세스에 노출할 API
contextBridge.exposeInMainWorld("electronAPI", {
  // 환경 변수 관련
  getEnvVariable: (key: string) => ipcRenderer.invoke("get-env-variable", key),
  getAppInfo: () => ipcRenderer.invoke("get-app-info"),

  // 파일 시스템 관련
  saveFile: (options: { content: string; defaultPath: string; filters: { name: string; extensions: string[] }[] }) =>
    ipcRenderer.invoke("save-file", options),
  openFile: (options: { filters: { name: string; extensions: string[] }[] }) =>
    ipcRenderer.invoke("open-file", options),

  // 로컬 스토리지 관련
  storeGet: (key: string) => ipcRenderer.invoke("store-get", key),
  storeSet: (key: string, value: any) => ipcRenderer.invoke("store-set", key, value),
  storeDelete: (key: string) => ipcRenderer.invoke("store-delete", key),
  storeClear: () => ipcRenderer.invoke("store-clear"),
})

// 버전 정보 추가
contextBridge.exposeInMainWorld("appVersion", {
  version: "1.0.0",
})
