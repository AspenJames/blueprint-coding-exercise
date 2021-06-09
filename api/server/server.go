package server

import (
	"log"

	"github.com/gofiber/fiber/v2"
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

func InitAPIServer() *Server {
	app := fiber.New()

	// Define POST handler.
	app.Post("diagnostic-screener", func(c *fiber.Ctx) error {
		// Initialize a `requestBody` struct.
		body := new(requestBody)
		// Parse the request body from the context `c`, log and return any error.
		if err := c.BodyParser(body); err != nil {
			log.Println(err)
			return err
		}

		// TODO: score answers & return recommendation.
		log.Println(body)
		return c.JSON(body)
	})

	return &Server{
		app: app,
	}
}

func (s *Server) Run() error {
	return s.app.Listen(":3030")
}
