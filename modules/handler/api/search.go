package api

import (
	"RediPast/modules/database"

	"github.com/gofiber/fiber/v2"
	redidb "github.com/redi-db/redi.db.go"
)

func HandleSearch(api fiber.Router) {
	api.Get("/get", func(ctx *fiber.Ctx) error {
		id := ctx.FormValue("id")
		if id == "" {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "id is required",
			})
		}

		post, err := database.Posts.SearchOne(redidb.Filter{
			"id": id,
		})

		if err != nil {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		return ctx.JSON(fiber.Map{
			"id": post.(map[string]interface{})["id"],
			"language": post.(map[string]interface{})["language"],
			"experienceTime": post.(map[string]interface{})["experienceTime"],
			"content": post.(map[string]interface{})["content"],
		})
	})
}
