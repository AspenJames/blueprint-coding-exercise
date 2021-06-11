package static

import (
	"embed"
	"encoding/json"
)

// Assets represents the embedded static assets.
//go:embed *.json
var assets embed.FS

type DomainMapping map[string]string

func ReadDiagnosticScreener(screenerID string) (map[string]interface{}, error) {
	screenerJSON := map[string]interface{}{}
	filename := screenerID + ".json"
	bytes, err := assets.ReadFile(filename)
	if err != nil {
		return screenerJSON, err
	}
	err = json.Unmarshal(bytes, &screenerJSON)
	if err != nil {
		return screenerJSON, err
	}
	return screenerJSON, nil
}

// Read the configuration file defined at `dmFilename`, populating the given
// domain mapping. Returns a nil error in the case that parsing the file and
// populating the map was successful.
func ReadDomainMapping(dmFilename string) (DomainMapping, error) {
	// Init the domainMap.
	domainMap := make(DomainMapping)

	// Create a mapping struct to parse the DomainMapping file.
	mapping := new(struct {
		Mapping []struct {
			QuestionID string `json:"question_id"`
			Domain     string `json:"domain"`
		} `json:"mapping"`
	})

	// Read the DomainMapping file contents from the embedded assets.
	mapFile, err := assets.Open(dmFilename)
	if err != nil {
		return domainMap, err
	}
	// Ensure the file is closed.
	defer mapFile.Close()
	// file.Stat() will return an error if the file is not found.
	fileStat, err := mapFile.Stat()
	if err != nil {
		return domainMap, err
	}
	// Init a byte array to hold the file contents.
	mapData := make([]byte, fileStat.Size())
	_, err = mapFile.Read(mapData)
	if err != nil {
		return domainMap, err
	}
	// Unmarshal data into mapping struct, capture any error.
	err = json.Unmarshal(mapData, mapping)
	if err != nil {
		return domainMap, err
	}
	// Iterate over mapping struct, populate domainMap.
	for _, mapPair := range mapping.Mapping {
		domainMap[mapPair.QuestionID] = mapPair.Domain
	}
	return domainMap, nil
}
