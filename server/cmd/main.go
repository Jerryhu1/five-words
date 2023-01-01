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

	redisURL := os.Getenv("REDIS_URL")
	if redisURL == "" {
		redisURL = "redis://:p4ssw0rd@localhost:6379/"
	}

	err = http.Setup(port, redisURL, "./card/data/words-simply.json")
	if err != nil {
		log.Fatal(err)
	}
}
