package server

import (
	"log"
	"sort"

	"github.com/aspenjames/blueprint-coding-exercise/api/static"
	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/limiter"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/fiber/v2/middleware/recover"
	"github.com/gofiber/fiber/v2/middleware/requestid"
)

type Server struct {
	app *fiber.App
}

// requestBody holds a list of structs representing diagnostic screener answers.
type requestBody struct {
	Answers []struct {
		Value      int    `json:"value"`
		QuestionID string `json:"question_id"`
	} `json:"answers"`
}

// response holds a list of assessment results.
type response struct {
	Results []string `json:"results"`
}

// analyzeScores accepts a map in the form {domain: score} and returns a list of
// recommended assessments.
func analyzeScores(scores map[string]int) []string {
	// Use a map to cheaply ensure uniqueness of keys (avoids duplicate
	// assessments in the response).
	asmtMap := make(map[string]struct{})
	domainScoreThreshhold := map[string]int{
		"depression":    2,
		"mania":         2,
		"anxiety":       2,
		"substance_use": 1,
	}
	domainAssessments := map[string]string{
		"depression":    "PHQ-9",
		"mania":         "ASRM",
		"anxiety":       "PHQ-9",
		"substance_use": "ASSIST",
	}
	for domain, threshhold := range domainScoreThreshhold {
		if scores[domain] >= threshhold {
			// Get the relevant assessment & add to the map.
			asmt := domainAssessments[domain]
			asmtMap[asmt] = struct{}{}
		}
	}
	// Collect asmtMap keys into a slice. Use the length of the assessment map to
	// allocate the exact size array needed.
	assessments := make([]string, len(asmtMap))
	// Use an iterator to avoid allocating extra memory in the underlying array.
	i := 0
	for asmt := range asmtMap {
		assessments[i] = asmt
		i++
	}
	sort.Strings(assessments)
	return assessments
}

func InitAPIServer(domainMap static.DomainMapping) *Server {
	// Init application.
	app := fiber.New()

	// Define middlewares.
	app.Use(recover.New())
	app.Use(limiter.New())
	app.Use(requestid.New())
	app.Use(logger.New())

	// Define request handlers.
	app.Get("diagnostic-screener/:screenerID", func(c *fiber.Ctx) error {
		screenerID := c.Params("screenerID")
		screenerData, err := static.ReadDiagnosticScreener(screenerID)
		if err != nil {
			return err
		}
		return c.JSON(screenerData)
	})

	app.Post("diagnostic-screener", func(c *fiber.Ctx) error {
		// Initialize a requestBody and response structs.
		body := new(requestBody)
		resp := new(response)
		// Parse the request body from the context `c`, log and return any error.
		if err := c.BodyParser(body); err != nil {
			log.Println(err)
			return err
		}
		// Initialize a map to hold scores.
		scores := make(map[string]int)
		// Loop over given Answers & tally scores.
		for _, answer := range body.Answers {
			// Get associated domain from the mapping.
			domain := domainMap[answer.QuestionID]
			if len(domain) == 0 {
				// Unknown QuestionID, log and ignore for now.
				log.Printf("QuestionID %s not found in domainMap %v\n", answer.QuestionID, domainMap)
				continue
			}
			scores[domain] = scores[domain] + answer.Value
		}

		// Analyze scores and add assessments to the response.
		resp.Results = analyzeScores(scores)
		return c.JSON(resp)
	})

	return &Server{
		app: app,
	}
}

func (s *Server) Run() error {
	return s.app.Listen(":3030")
}
