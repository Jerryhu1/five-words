package main

import (
	"fmt"
	"log"
	"os"

	"github.com/jerryhu1/five-words/http"
	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env.local")
	if err != nil {
		fmt.Println("No local env file found, using defaults")
	}

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	redisHost := os.Getenv("REDIS_HOST")
	redisPassword := os.Getenv("REDIS_PASSWORD")
	redisPort := os.Getenv("REDIS_PORT")

	serverType := os.Getenv("SERVER_TYPE")

	if serverType == "grpc" {

		grpc := NewServer(grpcPort)
		api.New(grpc)

	} else {
		err = http.Setup(port, redisHost, redisPort, redisPassword, "./card/data/words-simply.json")
		if err != nil {
			log.Fatal(err)
		}
	}
}
