package routing

import "github.com/gofiber/fiber/v2"

func HandleStatic(app fiber.Router) {
	app.Get("/public/:type/:file", func(ctx *fiber.Ctx) error {
		_type := ctx.Params("type")
		_file := ctx.Params("file")

		if static[_type] == nil {
			return ctx.Status(404).SendString("Type not found")
		}

		if static[_type][_file].Header == "" {
			return ctx.Status(404).SendString("File not found")
		}

		ctx.Set("Content-Type", static[_type][_file].Header)
		return ctx.SendString(string(static[_type][_file].Content))
	})
}