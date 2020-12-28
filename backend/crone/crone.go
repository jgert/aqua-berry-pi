package crone

import (
	"fmt"
	"github.com/jasonlvhit/gocron"
	"github.com/jgert/ds18b20"
	"log"
	"main/api"
	"main/store"
	"time"
)

func Start(
	refreshTime time.Duration,
	service ds18b20.SensorsService,
	sensorsStore store.TemperatureSensorsStore,
	dataStore store.TemperatureDataStore) (chan bool, error) {

	startTime := time.Now().
		Truncate(refreshTime).
		Add(refreshTime)

	err := gocron.Every(
		uint64(refreshTime/time.Second)).
		Seconds().
		From(&startTime).
		Do(scan, service, sensorsStore, dataStore, refreshTime)

	if err != nil {
		return nil, err
	}

	return gocron.Start(), nil
}

func scan(
	service ds18b20.SensorsService,
	sensorsStore store.TemperatureSensorsStore,
	dataStore store.TemperatureDataStore,
	refreshTime time.Duration) {

	fmt.Println("SCAN", time.Now().Truncate(refreshTime), service)

	items, err := sensorsStore.List()
	if err != nil {
		log.Println(err.Error())
		return
	}

	scanTime := time.Now().Truncate(refreshTime)

	for _, v := range items {
		value, err := service.ReadTemperature(v.GetW1ID())
		if err != nil {
			log.Printf("Read %s errror %s\n", v.GetW1ID(), err.Error())
			continue
		}
		fmt.Printf("%s: %2.2f\n", v.GetName(), value)
		err = dataStore.Add(v.GetID(), model{
			ScanTime: scanTime,
			Value:    value,
		})
		if err != nil {
			log.Printf(err.Error())
			continue
		}
	}
}

type model api.TemperatureData

func (m model) GetDateTime() time.Time {
	return m.ScanTime
}

func (m model) GetValue() float64 {
	return m.Value
}
