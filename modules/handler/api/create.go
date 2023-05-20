package api

import (
	"RediPast/modules/config"
	"RediPast/modules/database"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"strconv"
	"strings"
	"time"

	fiber "github.com/gofiber/fiber/v2"
	redidb "github.com/redi-db/redi.db.go"
	"golang.org/x/exp/slices"
)

var allowedExperience = map[string]time.Duration{
	"1d": time.Hour * 24,
	"3d": time.Hour * (24 * 3),

	"w": (time.Hour * 24) * 7,
	"m": time.Hour * 730,
	"n": 0,
}

var allowedMarkdowns = []string{
	"markdown",
	"javascript",
	"python",
	"brainfuck",
	"clike",
	"coffeescript",
	"css",
	"dart",
	"diff",
	"django",
	"go",
	"groovy",
	"haml",
	"jsx",
	"lua",
	"nginx",
	"pascal",
	"perl",
	"ruby",
	"powershell",
	"php",
	"shell",
	"vue",
	"xml",
	"yaml",
}

func HandleCreate(api fiber.Router) {
	api.Post("/create", func(ctx *fiber.Ctx) error {
		var data struct {
			Token string `json:"token"`

			Content  string `json:"content"`
			Language string `json:"language"`

			Name           string `json:"name"`
			ExperienceTime string `json:"experienceTime"`
		}

		if err := ctx.BodyParser(&data); err != nil {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		if data.Content == "" {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "Content is required field",
			})
		}

		if data.ExperienceTime == "" {
			data.ExperienceTime = "1d"
		}

		if data.Language == "" {
			data.Language = "markdown"
		}

		if !slices.Contains(allowedMarkdowns, data.Language) {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": fmt.Sprintf("Supported only %s languages", strings.Join(allowedMarkdowns, ", ")),
			})
		}

		if data.ExperienceTime == "n" && data.Token != config.Get().Web.AccessToken {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "n(ever) flag requires token: Invalid token",
			})
		}

		if _, ok := allowedExperience[data.ExperienceTime]; !ok {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": "experienceTime is invalid (only 1d, 3d, w, m and n)",
			})
		}

		id := generate(20)
		if data.Name != "" {
			id = data.Name

			if _, err := database.Posts.SearchOne(redidb.Filter{
				"id": data.Name,
			}); err != redidb.NOT_FOUND {
				return ctx.JSON(fiber.Map{
					"success": false,
					"message": "Name already used",
				})
			}
		}

		if _, err := database.Posts.Create(redidb.CreateData{
			"id":             id,
			"type":           data.ExperienceTime,
			"experienceTime": strconv.Itoa(int((time.Now().UTC().UnixNano() / 1e6) + int64(allowedExperience[data.ExperienceTime].Seconds()*1000))),
			"content":        data.Content,
			"language":       data.Language,
		}); err != nil {
			return ctx.JSON(fiber.Map{
				"success": false,
				"message": err.Error(),
			})
		}

		return ctx.JSON(fiber.Map{
			"success": true,
			"id":      id,
		})
	})
}

func generate(length int) string {
	b := make([]byte, length)
	if _, err := rand.Read(b); err != nil {
		return ""
	}
	return hex.EncodeToString(b)
}
