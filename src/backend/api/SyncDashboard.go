package api

import (
	"encoding/json"
	"net/http"

	"../models"
)

func SyncDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Decode data
	var dashboard models.Dashboard
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&dashboard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	switch r.Method {
		case "POST":
			err := dashboard.Create()

			if err == nil {
				json.NewEncoder(w).Encode(dashboard)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			break
		case "GET":
			dashboard, err := dashboard.Read()

			if err == nil {
				json.NewEncoder(w).Encode(dashboard)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			break
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)	
	}

	return
}
