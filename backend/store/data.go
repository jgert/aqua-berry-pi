package store

import "time"

type TemperatureData interface {
	GetDateTime() time.Time
	GetValue() float64
}

type TemperatureDataStore interface {
	List(temperatureSensorID string, from, to time.Time) ([]TemperatureData, error)
	Add(temperatureSensorID string, value TemperatureData) error
}
