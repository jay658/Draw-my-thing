type LinesT = {
  tool: string
  points: number[],
  stroke: string,
  strokeWidth: string,
  ratio: number[],
  width: number,
  height: number
}

type SettingsT = {
  tool: string,
  stroke: string,
  strokeWidth: string
}

export type {
  LinesT,
  SettingsT,
}