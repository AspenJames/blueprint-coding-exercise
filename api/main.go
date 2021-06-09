package main

import (
	"log"

	"github.com/aspenjames/blueprint-coding-exercise/api/server"
	"github.com/aspenjames/blueprint-coding-exercise/api/static"
)

var (
	// The name of the domain mapping configuration file.
	dmFilename = "domainMapping.json"
)

func main() {
	// Read the domain mapping config.
	domainMap, err := static.ReadDomainMapping(dmFilename)
	if err != nil {
		log.Fatal(err)
	}

	// Init and run the API.
	api := server.InitAPIServer(domainMap)
	log.Fatal(api.Run())
}
