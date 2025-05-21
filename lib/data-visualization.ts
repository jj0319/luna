/**
 * Data Visualization System
 *
 * 데이터 시각화 기능을 제공합니다.
 */

export interface ChartOptions {
  type: "bar" | "line" | "pie" | "scatter" | "radar" | "heatmap"
  title?: string
  xAxisLabel?: string
  yAxisLabel?: string
  colors?: string[]
  showLegend?: boolean
  showGrid?: boolean
  animation?: boolean
  responsive?: boolean
  theme?: "light" | "dark"
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string | string[]
    borderColor?: string | string[]
    borderWidth?: number
  }[]
}

export interface ChartResult {
  chartId: string
  chartType: string
  config: any
  timestamp: number
}

export class DataVisualizer {
  private chartCount = 0
  private chartHistory: Map<string, ChartResult> = new Map()
  private defaultColors: string[] = [
    "#4285F4",
    "#EA4335",
    "#FBBC05",
    "#34A853",
    "#FF6D01",
    "#46BDC6",
    "#7BAAF7",
    "#F07B72",
    "#FCD04F",
    "#71C287",
    "#FFB054",
    "#7DCFDA",
  ]

  constructor() {
    this.loadHistory()
  }

  /**
   * 차트 생성
   */
  public createChart(data: ChartData, options: ChartOptions): ChartResult {
    const chartId = `chart_${++this.chartCount}_${Date.now()}`
    const chartType = options.type

    // 기본 옵션 설정
    const defaultOptions = {
      responsive: true,
      maintainAspectRatio: true,
      animation: {
        duration: options.animation ? 1000 : 0,
      },
      plugins: {
        legend: {
          display: options.showLegend !== false,
          position: "top" as const,
        },
        title: {
          display: !!options.title,
          text: options.title || "",
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: !!options.xAxisLabel,
            text: options.xAxisLabel || "",
          },
          grid: {
            display: options.showGrid !== false,
          },
        },
        y: {
          display: true,
          title: {
            display: !!options.yAxisLabel,
            text: options.yAxisLabel || "",
          },
          grid: {
            display: options.showGrid !== false,
          },
        },
      },
    }

    // 데이터셋 색상 설정
    data.datasets.forEach((dataset, index) => {
      const color = options.colors?.[index] || this.defaultColors[index % this.defaultColors.length]

      if (!dataset.backgroundColor) {
        if (options.type === "line") {
          dataset.backgroundColor = this.hexToRgba(color, 0.2)
        } else {
          dataset.backgroundColor = dataset.data.map(
            (_, i) => options.colors?.[i] || this.defaultColors[i % this.defaultColors.length],
          )
        }
      }

      if (!dataset.borderColor) {
        if (options.type === "line") {
          dataset.borderColor = color
        } else {
          dataset.borderColor = dataset.data.map(
            (_, i) => options.colors?.[i] || this.defaultColors[i % this.defaultColors.length],
          )
        }
      }

      if (!dataset.borderWidth) {
        dataset.borderWidth = 1
      }
    })

    // 차트 설정
    const config = {
      type: chartType,
      data: data,
      options: defaultOptions,
    }

    // 차트 유형별 특수 설정
    if (chartType === "pie") {
      delete config.options.scales
    } else if (chartType === "radar") {
      delete config.options.scales
    } else if (chartType === "heatmap") {
      // 히트맵 특수 설정
    }

    // 테마 적용
    if (options.theme === "dark") {
      this.applyDarkTheme(config)
    }

    // 결과 생성
    const result: ChartResult = {
      chartId,
      chartType,
      config,
      timestamp: Date.now(),
    }

    // 히스토리에 추가
    this.chartHistory.set(chartId, result)
    this.saveHistory()

    return result
  }

  /**
   * 차트 가져오기
   */
  public getChart(chartId: string): ChartResult | undefined {
    return this.chartHistory.get(chartId)
  }

  /**
   * 모든 차트 가져오기
   */
  public getAllCharts(): ChartResult[] {
    return Array.from(this.chartHistory.values()).sort((a, b) => b.timestamp - a.timestamp)
  }

  /**
   * 차트 삭제
   */
  public deleteChart(chartId: string): boolean {
    const deleted = this.chartHistory.delete(chartId)

    if (deleted) {
      this.saveHistory()
    }

    return deleted
  }

  /**
   * 모든 차트 삭제
   */
  public clearAllCharts(): void {
    this.chartHistory.clear()
    this.saveHistory()
  }

  /**
   * 16진수 색상을 RGBA로 변환
   */
  private hexToRgba(hex: string, alpha: number): string {
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)

    return `rgba(${r}, ${g}, ${b}, ${alpha})`
  }

  /**
   * 다크 테마 적용
   */
  private applyDarkTheme(config: any): void {
    const textColor = "#E0E0E0"
    const gridColor = "rgba(255, 255, 255, 0.1)"

    // 타이틀 색상
    if (config.options.plugins?.title) {
      config.options.plugins.title.color = textColor
    }

    // 범례 색상
    if (config.options.plugins?.legend) {
      config.options.plugins.legend.labels = {
        color: textColor,
      }
    }

    // 축 색상
    if (config.options.scales) {
      if (config.options.scales.x) {
        config.options.scales.x.ticks = {
          color: textColor,
        }
        config.options.scales.x.grid = {
          color: gridColor,
        }
        if (config.options.scales.x.title) {
          config.options.scales.x.title.color = textColor
        }
      }

      if (config.options.scales.y) {
        config.options.scales.y.ticks = {
          color: textColor,
        }
        config.options.scales.y.grid = {
          color: gridColor,
        }
        if (config.options.scales.y.title) {
          config.options.scales.y.title.color = textColor
        }
      }
    }
  }

  /**
   * 히스토리 로드
   */
  private loadHistory(): void {
    if (typeof window === "undefined") return

    try {
      const savedHistory = localStorage.getItem("chart_history")

      if (savedHistory) {
        const history = JSON.parse(savedHistory)
        this.chartHistory = new Map(history)

        // 차트 카운트 업데이트
        this.chartCount = Math.max(
          0,
          ...Array.from(this.chartHistory.keys()).map((id) => {
            const match = id.match(/chart_(\d+)_/)
            return match ? Number.parseInt(match[1]) : 0
          }),
        )
      }
    } catch (error) {
      console.error("Failed to load chart history:", error)
    }
  }

  /**
   * 히스토리 저장
   */
  private saveHistory(): void {
    if (typeof window === "undefined") return

    try {
      const history = Array.from(this.chartHistory.entries())
      localStorage.setItem("chart_history", JSON.stringify(history))
    } catch (error) {
      console.error("Failed to save chart history:", error)
    }
  }

  /**
   * 샘플 차트 데이터 생성
   */
  public createSampleData(type: "bar" | "line" | "pie" | "scatter" | "radar"): ChartData {
    switch (type) {
      case "bar":
        return {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
          datasets: [
            {
              label: "매출",
              data: [65, 59, 80, 81, 56, 55],
            },
          ],
        }

      case "line":
        return {
          labels: ["1월", "2월", "3월", "4월", "5월", "6월"],
          datasets: [
            {
              label: "방문자",
              data: [12, 19, 3, 5, 2, 3],
            },
          ],
        }

      case "pie":
        return {
          labels: ["빨강", "파랑", "노랑", "초록", "보라"],
          datasets: [
            {
              label: "선호 색상",
              data: [12, 19, 3, 5, 2],
            },
          ],
        }

      case "scatter":
        return {
          labels: ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"],
          datasets: [
            {
              label: "산점도",
              data: [
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
                Math.random() * 100,
              ],
            },
          ],
        }

      case "radar":
        return {
          labels: ["식사", "음료", "디저트", "서비스", "분위기", "가격"],
          datasets: [
            {
              label: "만족도",
              data: [65, 59, 90, 81, 56, 55],
            },
          ],
        }

      default:
        return {
          labels: ["A", "B", "C", "D", "E"],
          datasets: [
            {
              label: "데이터",
              data: [12, 19, 3, 5, 2],
            },
          ],
        }
    }
  }
}

// 싱글톤 인스턴스 생성
export const dataVisualizer = new DataVisualizer()
