package api

import (
	"encoding/json"
	"net/http"

	"../models"
)

func SyncTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Decode data
	var task models.Task
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	switch r.Method {
		case "POST":
			err := task.Create()

			if err == nil {
				json.NewEncoder(w).Encode(task)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			break
		case "GET":
			task, err := task.Read()

			if err == nil {
				json.NewEncoder(w).Encode(task)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			break
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)	
	}

	return
}
