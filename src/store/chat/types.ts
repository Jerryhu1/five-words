export const ADD_MESSAGE = "ADD_MESSAGE"
export const SET_ENABLE = "SET_ENABLE"

export interface ChatState {
  messages: Message[]
  enabled: boolean
}

export type Message = {
  timestamp: Date
  text: string
  playerName: string
  playerID: string
}