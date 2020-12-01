package dbstore

import (
	"gorm.io/gorm"
	"main/store"
	"strconv"
	"time"
)

type temperatureDataStore struct {
	db *gorm.DB
}

func NewTemperatureDataStore(db *gorm.DB) store.TemperatureDataStore {
	obj := temperatureDataStore{db: db}
	return obj
}

func (t temperatureDataStore) List(temperatureSensorID string, from, to time.Time) ([]store.TemperatureData, error) {

	var dataValues []temperatureData
	result := t.db.
		Where("temperature_sensor_id = ? AND date_time >= ? AND date_time < ?", temperatureSensorID, from, to).
		Find(&dataValues)

	if result.Error != nil {
		return []store.TemperatureData{}, result.Error
	}

	var items = make([]store.TemperatureData, len(dataValues))
	for i, v := range dataValues {
		items[i] = v
	}

	return items, nil
}

func (t temperatureDataStore) Add(temperatureSensorID string, value store.TemperatureData) error {

	id, err := strconv.ParseUint(temperatureSensorID, 10, 32)

	if err != nil {
		return err
	}

	obj := temperatureData{
		DateTime:            value.GetDateTime(),
		Value:               value.GetValue(),
		TemperatureSensorID: uint(id),
	}

	result := t.db.Create(&obj)
	return result.Error
}
