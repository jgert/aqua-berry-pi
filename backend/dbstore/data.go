package dbstore

import (
	"gorm.io/gorm"
	"time"
)

type temperatureData struct {
	gorm.Model
	Value               float64
	DateTime            time.Time
	TemperatureSensorID uint
}

func (t temperatureData) GetDateTime() time.Time {
	return t.UpdatedAt
}

func (t temperatureData) GetValue() float64 {
	return t.Value
}
