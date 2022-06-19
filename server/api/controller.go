package api

import (
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	"github.com/jerryhu1/five-words/room"
	"io"
	"io/ioutil"
	"net/http"
)

type RoomController struct {
	room *room.Service
}

func (ctrl *RoomController) GetRoom(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")

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
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")

	res, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	var params room.CreateRoomParams
	err = json.Unmarshal(res, &params)
	if err != nil {
		http.Error(w, err.Error(), http.StatusUnprocessableEntity)
		return
	}

	create, err := ctrl.room.Create(params)
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

type SetPlayerTeamParams struct {
	Player  string `json:"player"`
	NewTeam string `json:"newTeam"`
}

func (ctrl *RoomController) SetPlayerTeam(w http.ResponseWriter, r *http.Request) {
	w.Header().Add("Access-Control-Allow-Origin", "*")
	w.Header().Add("Content-Type", "application/json")
	roomName := mux.Vars(r)["roomName"]
	var params SetPlayerTeamParams
	res, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("Could not add player to team, err: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	err = json.Unmarshal(res, &params)
	if err != nil {
		fmt.Printf("Could not add player to team, err: %s", err)
		http.Error(w, err.Error(), http.StatusBadRequest)
	}

	state, err := ctrl.room.SetPlayerTeam(roomName, params.Player, params.NewTeam)
	if err != nil {
		fmt.Printf("Could not add player to room, err: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	js, err := json.Marshal(state)
	if err != nil {
		fmt.Printf("Could not add player to room, err: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)

	}
	if _, err := w.Write(js); err != nil {
		fmt.Printf("Could not add player to room, err: %s", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
}

func NewCtrl(srv *room.Service) *RoomController {
	return &RoomController{room: srv}
}
