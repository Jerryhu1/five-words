package postgres

import (
	"context"
	"fmt"
	"github.com/jmoiron/sqlx"
)

const (
	host     = "localhost"
	port     = 5432
	user     = "dev"
	password = "p4ssw0rd"
	dbname   = "five-words"
)

type Store struct {
	db *sqlx.DB
}

func (s Store) CreateRoom(ctx context.Context, name string) {
}

func New() (Store, error) {
	db, err := sqlx.Open("postgres", connStr())
	if err != nil {
		return Store{}, err
	}

	return Store{db: db}, nil
}

func connStr() string {
	return fmt.Sprintf("host=%s port=%d user=%s password=%s sslmode=disable",
		host, port, user, password)
}
