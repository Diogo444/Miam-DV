export interface Proverbe {
  id: number
  type: string
  content: string
}

export interface ProverbeResponse {
  message: string
  proverbe: Proverbe | null
}
