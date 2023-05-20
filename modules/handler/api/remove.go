package api

import (
	"RediPast/modules/database"

	fiber "github.com/gofiber/fiber/v2"
	redidb "github.com/redi-db/redi.db.go"
)

func HandleDelete(api fiber.Router) {
	api.Delete("/remove", func(ctx *fiber.Ctx) error {
		var data struct {
			Token string `json:"token"`
			Id string `json:"post_id"`
		}

		if err := ctx.BodyParser(&data); err != nil {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		if data.Id == "" {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "post_id is required field",
			})
		}

		if _, err := database.Posts.SearchOne(redidb.Filter{
			"id": data.Id,
		}); err == redidb.NOT_FOUND {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "Not Found",
			})
		}

		if _, err := database.Posts.Delete(redidb.Filter{
			"id": data.Id,
		}); err != nil {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		return ctx.JSON(fiber.Map{
			"success": true,
		})
	})
}
