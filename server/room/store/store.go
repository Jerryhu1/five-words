package redis

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/go-redis/redis"
	"github.com/jerryhu1/five-words/room"
	"github.com/jerryhu1/five-words/room/state"
)

type Store struct {
	client *redis.Client
}

func (s *Store) GetRoomState(name string) (state.RoomState, error) {
	res, err := s.client.Get(name).Result()
	if errors.Is(err, redis.Nil) {
		fmt.Printf("Key: %s does not exist", name)
	}
	if err != nil {
		return state.RoomState{}, err
	}

	finalRes := state.RoomState{}
	if err = json.Unmarshal([]byte(res), &finalRes); err != nil {
		return state.RoomState{}, err
	}

	return finalRes, nil
}

func (s *Store) SetRoomState(room state.RoomState) (state.RoomState, error) {
	js, err := json.Marshal(room)
	if err != nil {
		return state.RoomState{}, err
	}
	// Keep room state for 24 hours
	op := s.client.Set(room.Name, js, time.Hour*24)
	if op.Err() != nil {
		return state.RoomState{}, op.Err()
	}

	return s.GetRoomState(room.Name)
}

func NewStore(host string, port string, username string, password string) (room.Store, error) {
	redisClient := redis.NewClient(
		&redis.Options{
			Addr:     fmt.Sprintf("%s:%s", host, port),
			Password: password,
			DB:       0,
		},
	)

	pong, err := redisClient.Ping().Result()
	if err != nil {
		fmt.Println(pong, err)
		return nil, err
	}

	return &Store{client: redisClient}, nil
}
