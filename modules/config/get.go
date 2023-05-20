package config

import (
	"RediPast/modules/structure"
)

func Get() structure.Config {
	if !cache.GetInit() {
		load()
	}

	return cache
}
