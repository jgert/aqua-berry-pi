package api

import (
	"main/store"
)

type TemperatureSensor struct {
	ID   string `json:"id"`
	Name string `json:"name"`
	W1ID string `json:"w1id"`
}

func (t TemperatureSensor) GetID() string {
	return t.ID
}

func (t TemperatureSensor) GetName() string {
	return t.Name
}

func (t TemperatureSensor) GetW1ID() string {
	return t.W1ID
}

func AsTemperatureSensor(v store.TemperatureSensor) TemperatureSensor {
	return TemperatureSensor{
		ID:   v.GetID(),
		Name: v.GetName(),
		W1ID: v.GetW1ID(),
	}
}
