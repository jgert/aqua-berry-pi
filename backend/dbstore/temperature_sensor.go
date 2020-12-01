package dbstore

import (
	"gorm.io/gorm"
	"main/store"
	"strconv"
)

type temperatureSensor struct {
	gorm.Model
	Name string
	W1ID string
}

func (t temperatureSensor) GetID() string {
	return strconv.FormatUint(uint64(t.ID), 10)
}

func (t temperatureSensor) GetName() string {
	return t.Name
}

func (t temperatureSensor) GetW1ID() string {
	return t.W1ID
}

func asTemperatureSensor(v store.TemperatureSensor) (temperatureSensor, error) {
	id, err := strconv.ParseUint(v.GetID(), 10, 32)

	if err != nil {
		return temperatureSensor{}, err
	}

	return temperatureSensor{
		Model: gorm.Model{
			ID: uint(id),
		},
		Name: v.GetName(),
		W1ID: v.GetW1ID(),
	}, nil
}
