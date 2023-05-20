package api

import (
	"RediPast/modules/database"

	fiber "github.com/gofiber/fiber/v2"
	redidb "github.com/redi-db/redi.db.go"
)

func HandleUpdate(api fiber.Router) {
	api.Put("/update", func(ctx *fiber.Ctx) error {
		var data struct {
			Id      string `json:"post_id"`
			Content string `json:"content"`
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

		if data.Content == "" {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "content is required field",
			})
		}

		post, err := database.Posts.SearchOne(redidb.Filter{
			"id": data.Id,
		})

		if err != nil {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		if post.(map[string]interface{})["content"] == data.Content {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "The old content is identical to the new content",
			})
		}

		if _, err := database.Posts.Update(redidb.Filter{
			"id": data.Id,
		}, redidb.UpdateData{
			"content": data.Content,
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
