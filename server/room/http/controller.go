package api

import (
	"encoding/json"
	"io"
	"net/http"

	"github.com/gorilla/mux"
	"github.com/jerryhu1/five-words/room"
)

type RoomController struct {
	room *room.Service
}

type CreateRoomParams struct {
	Owner     string `json:"owner"`
	ScoreGoal int    `json:"scoreGoal"`
	Language  string `json:"language"`
	Teams     int    `json:"teams"`
}

func NewController(srv *room.Service) *RoomController {
	return &RoomController{room: srv}
}

func (ctrl *RoomController) GetRoom(w http.ResponseWriter, r *http.Request) {
	setHeaders(w)

	roomName := mux.Vars(r)["roomName"]

	res, err := ctrl.room.GetByName(roomName)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	js, err := json.Marshal(res)
	if _, err := w.Write(js); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func (ctrl *RoomController) CreateRoom(w http.ResponseWriter, r *http.Request) {
	setHeaders(w)
	res, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var params CreateRoomParams
	err = json.Unmarshal(res, &params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	create, err := ctrl.room.Create(params.Owner, params.ScoreGoal, params.Language, params.Teams)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	js, err := json.Marshal(create)
	if _, err := w.Write(js); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func setHeaders(w http.ResponseWriter) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")
}
