package dbstore

import (
	"errors"
	"fmt"
	"gorm.io/gorm"
	"main/store"
)

type temperatureSensorsStore struct {
	db *gorm.DB
}

func NewTemperatureSensorsStore(db *gorm.DB) store.TemperatureSensorsStore {
	return temperatureSensorsStore{
		db: db,
	}
}

func (p temperatureSensorsStore) List() ([]store.TemperatureSensor, error) {

	var sensors []temperatureSensor
	result := p.db.Find(&sensors)
	if result.Error != nil {
		return nil, result.Error
	}

	var items = make([]store.TemperatureSensor, len(sensors))
	for i, v := range sensors {
		items[i] = v
	}

	return items, nil
}

func (p temperatureSensorsStore) Add(sensor store.TemperatureSensor) (store.TemperatureSensor, error) {

	dbSensor, err := asTemperatureSensor(sensor)

	if err != nil {
		return nil, err
	}

	result := p.db.Create(&dbSensor)

	if result.Error != nil {
		return nil, result.Error
	}

	return dbSensor, nil
}

func (p temperatureSensorsStore) Delete(sensorID string) error {

	result := p.db.Delete(&temperatureSensor{}, sensorID)
	if result.Error != nil {
		return result.Error
	}

	if result.RowsAffected == 0 {
		return errors.New(fmt.Sprintf("temperature sensor not found for id=%d", sensorID))
	}

	return nil
}

func (p temperatureSensorsStore) Update(sensor store.TemperatureSensor) (store.TemperatureSensor, error) {

	dbSensor, err := asTemperatureSensor(sensor)

	if err != nil {
		return nil, err
	}

	result := p.db.Save(dbSensor)
	if result.Error != nil {
		return nil, result.Error
	}

	if result.RowsAffected == 0 {
		return nil, errors.New(fmt.Sprintf("temperature sensor not found for id=%d", sensor.GetID()))
	}

	return sensor, nil
}
