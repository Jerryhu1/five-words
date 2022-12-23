package message

type MessageType string

const (
	ClientRegistered MessageType = "CLIENT_REGISTERED"
	AddTeamPlayer    MessageType = "ADD_TEAM_PLAYER"
	AddPlayerToRoom  MessageType = "ADD_PLAYER_TO_ROOM"
	StartGame        MessageType = "START_GAME"
	StartRound       MessageType = "START_ROUND"
	SendMessage      MessageType = "SEND_MESSAGE"
	JoinRoom         MessageType = "JOIN_ROOM"
	RestartGame      MessageType = "RESTART_GAME"
	ToLobby          MessageType = "TO_LOBBY"
	SetRoom          MessageType = "SET_ROOM"
	TimerFinished    MessageType = "TIMER_FINISHED"
	AddMessage       MessageType = "ADD_MESSAGE"
)

type JoinRoomBody struct {
	RoomBody
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
