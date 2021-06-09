package main

import (
	"log"

	"github.com/aspenjames/blueprint-coding-exercise/api/server"
)

func main() {
	// Init and run the API.
	api := server.InitAPIServer()
	log.Fatal(api.Run())
}
