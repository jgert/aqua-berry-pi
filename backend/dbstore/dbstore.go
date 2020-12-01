package dbstore

import (
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func Migrate(db *gorm.DB) error {
	var err error

	err = db.AutoMigrate(&temperatureSensor{})
	if err != nil {
		return err
	}

	err = db.AutoMigrate(&temperatureData{})
	if err != nil {
		return nil
	}

	return nil
}

func Open(fileName string) (*gorm.DB, error) {
	db, err := gorm.Open(sqlite.Open(fileName), &gorm.Config{})
	if err != nil {
		return nil, err
	}

	err = Migrate(db)
	return db, nil
}
