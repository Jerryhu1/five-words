package api

type RoomServer interface {
	GetRoom(name string)
}

type Api struct {
}

func NewApi(r RoomServer) RoomServer {
	return r
}
