package api

import (
	"encoding/json"
	"github.com/gorilla/mux"
	"main/store"
	"net/http"
)

type temperatureSensorsService struct {
	store store.TemperatureSensorsStore
	w1    w1SensorsHandler
}

func (t *temperatureSensorsService) list(w http.ResponseWriter, _ *http.Request) {

	result, err := t.store.List()
	if err != nil {
		handleError(err, w)
		return
	}

	items := make([]TemperatureSensor, len(result))
	for i, v := range result {
		items[i] = AsTemperatureSensor(v)
	}

	respondJSON(items, w)
}

func (t *temperatureSensorsService) add(w http.ResponseWriter, r *http.Request) {

	var sensor TemperatureSensor
	err := json.NewDecoder(r.Body).Decode(&sensor)
	if err != nil {
		handleError(err, w)
		return
	}

	created, err := t.store.Add(sensor)

	if err != nil {
		handleError(err, w)
		return
	}

	respondJSON(AsTemperatureSensor(created), w)
}

func (t *temperatureSensorsService) update(w http.ResponseWriter, r *http.Request) {

	var sensor TemperatureSensor
	err := json.NewDecoder(r.Body).Decode(&sensor)
	if err != nil {
		handleError(err, w)
		return
	}

	created, err := t.store.Update(sensor)

	if err != nil {
		handleError(err, w)
		return
	}

	respondJSON(AsTemperatureSensor(created), w)
}

func (t *temperatureSensorsService) delete(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	err := t.store.Delete(vars["id"])
	if err != nil {
		handleError(err, w)
		return
	}

	w.WriteHeader(http.StatusOK)
}

func (t *temperatureSensorsService) temperature(w http.ResponseWriter, r *http.Request) {
	t.w1.getSensorValue(w, r)
}
