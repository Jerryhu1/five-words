package message

const (
	AddTeamPlayer   = "ADD_TEAM_PLAYER"
	AddPlayerToRoom = "ADD_PLAYER_TO_ROOM"
	StartGame       = "START_GAME"
	StartRound      = "START_ROUND"
	SendMessage     = "SEND_MESSAGE"
	JoinRoom        = "JOIN_ROOM"
	RestartGame     = "RESTART_GAME"
	ToLobby         = "TO_LOBBY"
)

type JoinRoomBody struct {
	RoomBody
	SessionID  string `json:"sessionID"`
	PlayerName string `json:"playerName"`
}

type RoomBody struct {
	RoomName string `json:"roomName"`
}

type AddTeamPlayerBody struct {
	RoomBody
	PlayerID string `json:"playerID"`
	Team     string `json:"team"`
}

type AddPlayerToRoomBody struct {
	RoomBody
	PlayerName string `json:"playerName"`
	SessionID  string `json:"sessionID"`
}

type StartGameBody struct {
	RoomBody
}

type StartRoundBody struct {
	RoomBody
	CountdownTime int `json:"countdownTime"`
	RoundTime     int `json:"roundTime"`
}

type TimerFinishedBody struct {
	RoomBody
}

type SendMessageBody struct {
	RoomBody
	Text       string `json:"text"`
	PlayerName string `json:"playerName"`
	PlayerID   string `json:"playerID"`
}

type RestartGameBody struct {
	RoomBody
}

type ToLobbyBody struct {
	RoomBody
}
