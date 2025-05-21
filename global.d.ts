interface Window {
  electronAPI?: {
    getEnvVariable: (key: string) => Promise<string | undefined>
    showSaveDialog: (options: any) => Promise<string | null>
    showOpenDialog: (options: any) => Promise<string | null>
    readFile: (filePath: string) => Promise<string | null>
    writeFile: (filePath: string, content: string) => Promise<boolean>
    installUpdate: () => Promise<void>
    onUpdateAvailable: (callback: () => void) => () => void
    onUpdateDownloaded: (callback: () => void) => () => void
  }
  env?: {
    isElectron: boolean
    appVersion: string
  }
}
