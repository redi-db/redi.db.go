package routing

import (
	"html/template"
	"log"

	"github.com/gofiber/fiber/v2"
)

func HandleCreate(app fiber.Router) {
	page := static["html"]["index.html"]
	_temaplte, err := template.New("Create Page").Parse(string(page.Content))
	
	if err != nil {
		log.Panicln(err)
	}

	app.Get("/", func(ctx *fiber.Ctx) error {
		ctx.Set("Content-Type", page.Header)
		return _temaplte.Execute(ctx, nil)
	})
}