package main

import (
	"github.com/jgert/ds18b20"
	"log"
	"main/api"
	"main/crone"
	"main/dbstore"
	"time"
)

func main() {

	db, err := dbstore.Open("database.db")
	if err != nil {
		log.Println(err)
		return
	}

	temperatureSensorsStore := dbstore.NewTemperatureSensorsStore(db)
	temperatureDataStore := dbstore.NewTemperatureDataStore(db)
	sensorsService := ds18b20.CreateSensorsService()

	_, err = crone.Start(time.Minute, sensorsService, temperatureSensorsStore, temperatureDataStore)
	if err != nil {
		log.Println(err)
		return
	}

	api.Start(&sensorsService, temperatureSensorsStore, temperatureDataStore)
}
