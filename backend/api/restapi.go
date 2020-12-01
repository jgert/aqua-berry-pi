package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"github.com/jgert/ds18b20"
	"github.com/rs/cors"
	"log"
	"main/store"
	"net/http"
)

func Start(sensorsService *ds18b20.SensorsService, sensorsStore store.TemperatureSensorsStore, dataStore store.TemperatureDataStore) {
	r := mux.NewRouter()

	w1SensorService := w1SensorsHandler{sensorsService: *sensorsService}
	temperatureSensorsServices := temperatureSensorsService{
		store: sensorsStore,
		w1:    w1SensorService,
	}

	temperatureDataService := temperatureDataHandler{
		store: dataStore,
	}

	r.HandleFunc("/w1sensors", w1SensorService.getSensors).Methods("GET")
	r.HandleFunc("/w1sensors/{id}", w1SensorService.getSensorValue).Methods("GET")
	r.HandleFunc("/temperature/sensors", temperatureSensorsServices.list).Methods("GET")
	r.HandleFunc("/temperature/sensors", temperatureSensorsServices.add).Methods("POST")
	r.HandleFunc("/temperature/sensors", temperatureSensorsServices.update).Methods("PUT")
	r.HandleFunc("/temperature/sensors/{id}", temperatureSensorsServices.delete).Methods("DELETE")
	r.HandleFunc("/temperature/values", temperatureDataService.values).
		Queries("from", "{from}", "to", "{to}", "id", "{id}").
		Methods("GET")

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"POST", "OPTIONS", "GET", "PUT", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		Debug:            true,
	})

	log.Fatal(http.ListenAndServe(":3001", c.Handler(r)))
}

func handleError(err error, w http.ResponseWriter) {
	log.Println(err)
	_, _ = w.Write([]byte(err.Error()))
	w.WriteHeader(http.StatusInternalServerError)
}

func respondJSON(v interface{}, w http.ResponseWriter) {
	data, err := json.Marshal(v)
	if err != nil {
		handleError(err, w)
		return
	}

	_, err = w.Write(data)
	if err != nil {
		log.Println(err.Error())
		return
	}

	w.Header().Add("Content-Type", "application/json")
}
