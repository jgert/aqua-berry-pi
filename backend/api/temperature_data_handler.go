package api

import (
	"github.com/gorilla/mux"
	"main/store"
	"net/http"
	"time"
)

type TemperatureData struct {
	ScanTime time.Time `json:"timestamp"`
	Value    float64   `json:"value"`
}

type temperatureDataHandler struct {
	store store.TemperatureDataStore
}

func (t temperatureDataHandler) values(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)

	id := vars["id"]

	from, err := time.Parse(time.RFC3339, vars["from"])
	if err != nil {
		handleError(err, w)
		return
	}

	to, err := time.Parse(time.RFC3339, vars["to"])
	if err != nil {
		handleError(err, w)
		return
	}

	data, err := t.store.List(id, from, to)
	if err != nil {
		handleError(err, w)
		return
	}

	items := make([]TemperatureData, len(data))
	for i, v := range data {
		items[i] = TemperatureData{
			ScanTime: v.GetDateTime(),
			Value:    v.GetValue(),
		}
	}
	respondJSON(items, w)
}
