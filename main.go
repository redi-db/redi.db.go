package main

import (
	"RediPast/modules/config"
	handler "RediPast/modules/handler"
	"log"
	"runtime/debug"
	"strconv"
)

func init() {
	log.Println("Preparing to start...")

	max := config.Get().Settings.MaxThreads
	if max < 10000 {
		log.Panicln("Minimum count of settings.max_threads is 10000")
	}

	debug.SetMaxThreads(max)
}

func main() {
	if err := handler.App.Listen(":" + strconv.Itoa(config.Get().Web.Port)); err != nil {
		log.Fatalln("Failed to listen server: ", err)
	}
}
