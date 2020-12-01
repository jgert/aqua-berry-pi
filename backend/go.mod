module main

go 1.13

//replace github.com/jgert/ds18b20 => ../../ds18b20

require (
	github.com/gorilla/mux v1.8.0
	github.com/jasonlvhit/gocron v0.0.1
	github.com/jgert/ds18b20 v1.0.2
	github.com/rs/cors v1.7.0
	github.com/stianeikeland/go-rpio/v4 v4.4.0
	gorm.io/driver/sqlite v1.1.3
	gorm.io/gorm v1.20.7
)
