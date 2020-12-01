package store

type TemperatureSensor interface {
	GetID() string
	GetName() string
	GetW1ID() string
}

type TemperatureSensorsStore interface {
	List() ([]TemperatureSensor, error)
	Add(sensor TemperatureSensor) (TemperatureSensor, error)
	Delete(sensorID string) error
	Update(sensor TemperatureSensor) (TemperatureSensor, error)
}
