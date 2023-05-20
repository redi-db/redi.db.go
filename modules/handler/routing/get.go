package routing

import (
	"RediPast/modules/database"
	"html/template"
	"log"

	"github.com/gofiber/fiber/v2"
	redidb "github.com/redi-db/redi.db.go"
)

func HandleGet(app fiber.Router) {
	page := static["html"]["view.html"]
	_temaplte, err := template.New("Look Page").Parse(string(page.Content))
	if err != nil {
		log.Panicln(err)
	}
	
	app.Get("/:id", func(ctx *fiber.Ctx) error {
		post, err := database.Posts.SearchOne(redidb.Filter{
			"id": ctx.Params("id"),
		})

		if err != nil {
			return ctx.Status(400).Redirect("/")
		}

		ctx.Set("Content-Type", page.Header)
		return _temaplte.Execute(ctx, post.(map[string]interface{}))
	})
}