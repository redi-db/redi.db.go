package handler

import (
	"RediPast/modules/config"
	"RediPast/modules/database"
	"RediPast/modules/handler/api"
	"RediPast/modules/handler/routing"
	"time"

	"RediPast/modules/structure"
	"log"
	"strconv"

	"github.com/goccy/go-json"
	fiber "github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	redidb "github.com/redi-db/redi.db.go"
	"golang.org/x/exp/slices"
)

var App = fiber.New(fiber.Config{
	DisableStartupMessage: true,
	ReduceMemoryUsage:     false,
	UnescapePath:          true,
	JSONEncoder:           json.Marshal,
	JSONDecoder:           json.Unmarshal,
})

var Api = App.Group("/api")
var reqWithoutToken = []string{
	"/api/create",
	"/api/search",
}

func init() {
	logout := time.NewTicker(time.Hour * 24)
	go func() {
		for {
			select {
				case <-logout.C:
					posts, err := database.Posts.Search(nil)
					if err != redidb.NOT_FOUND && err != nil {
						log.Panicln(err)
					}

					for _, postData := range posts {
						post := postData.(map[string]interface{})
						if post["type"] != "n" {
							postTime, err := strconv.Atoi(post["experienceTime"].(string))
							if err != nil {
								if _, err := database.Posts.Delete(redidb.Filter{
									"id": post["id"],
								}); err != nil {
									log.Println("Removing of breaked post failed:", err.Error())
								}

								continue
							}

							if int(time.Now().UTC().UnixNano() / 1e6) >= postTime {
								if _, err := database.Posts.Delete(redidb.Filter{
									"id": post["id"],
								}); err != nil {
									log.Println("Removing failed:", err.Error())
								}
							}
						}
					}
				}
		}
	}()

	App.Use(cors.New(cors.Config{
		AllowOrigins: "*",
		AllowHeaders: "*",
		AllowCredentials: true,
	}))

	App.Use(func(ctx *fiber.Ctx) error {
		if ctx.Method() != "GET" && !slices.Contains(reqWithoutToken, ctx.Path()) {
			ctx.Request().Header.Set("Content-Type", "application/json")

			var auth structure.Auth
			if err := ctx.BodyParser(&auth); err != nil {
				return ctx.JSON(fiber.Map{
					"success": false,
					"message": err.Error(),
				})
			}

			if auth.Token == "" {
				return ctx.JSON(fiber.Map{
					"success": false,
					"message": "token is required field",
				})
			}

			if config.Get().Web.AccessToken != auth.Token {
				return ctx.JSON(fiber.Map{
					"success": false,
					"message": "Invalid token",
				})
			}
		}

		return ctx.Next()
	})

	App.Hooks().OnListen(func() error {
		println()
		log.Println("Served server on port " + strconv.Itoa(config.Get().Web.Port))
		return nil
	})

	api.HandleSearch(Api)
	api.HandleCreate(Api)
	api.HandleUpdate(Api)
	api.HandleDelete(Api)

	routing.HandleStatic(App)
	routing.HandleRaw(App)
	routing.HandleGet(App)
	routing.HandleCreate(App)
}