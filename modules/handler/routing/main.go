package routing

import (
	"RediPast/modules/structure"
	"embed"
	"fmt"
	"log"
	"strings"
)

//go:embed all:public
var assets embed.FS
var static = map[string]map[string]structure.Static{}

func init() {
	dirs, err := assets.ReadDir("public")
	if err != nil {
		log.Panicln(err)
	}

	for _, dir := range dirs {
		if !dir.IsDir() {
			continue
		}

		files, err := assets.ReadDir(fmt.Sprintf("public/%s", dir.Name()))
		if err != nil {
			log.Panicln(err)
		}

		for _, file := range files {
			data := structure.Static{}
			content, err := assets.ReadFile(fmt.Sprintf("public/%s/%s", dir.Name(), file.Name()))
			if err != nil {
				log.Printf("Error on reading file: %s", err.Error())
			}

			fm := strings.Split(file.Name(), ".")
			switch (fm[len(fm)-1]) {
				case "css":
					data.Header = "text/css"
				case "js":
					data.Header = "application/javascript"
				case "html":
					data.Header = "text/html"
			}

			data.Content = content
			if static[dir.Name()] == nil {
				static[dir.Name()] = make(map[string]structure.Static)
			}

			static[dir.Name()][file.Name()] = data
		}
	}
}