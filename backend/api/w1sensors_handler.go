package api

import (
	"github.com/gorilla/mux"
	"github.com/jgert/ds18b20"
	"net/http"
	"time"
)

type w1SensorsHandler struct {
	sensorsService ds18b20.SensorsService
}

func (h *w1SensorsHandler) getSensors(w http.ResponseWriter, _ *http.Request) {

	sensors, err := h.sensorsService.Sensors()
	if err != nil {
		handleError(err, w)
		return
	}

	respondJSON(sensors, w)
}

func (h *w1SensorsHandler) getSensorValue(w http.ResponseWriter, r *http.Request) {

	vars := mux.Vars(r)
	id := vars["id"]
	val, err := h.sensorsService.ReadTemperature(id)
	if err != nil {
		handleError(err, w)
		return
	}

	data := TemperatureData{
		Timestamp: time.Now(),
		Value:     val,
	}

	respondJSON(data, w)
}
