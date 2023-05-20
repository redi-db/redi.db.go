package routing

import (
	"RediPast/modules/database"

	"github.com/gofiber/fiber/v2"
	redidb "github.com/redi-db/redi.db.go"
)

func HandleRaw(app fiber.Router) {
	app.Get("/raw/:id", func(ctx *fiber.Ctx) error {
		post, err := database.Posts.SearchOne(redidb.Filter{
			"id": ctx.Params("id"),
		})

		if err == redidb.NOT_FOUND {
			return ctx.SendString("")
		} else if err != nil {
			return ctx.SendStatus(404)
		}

		return ctx.SendString(post.(map[string]interface{})["content"].(string))
	})
}