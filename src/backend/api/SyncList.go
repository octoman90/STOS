package api

import (
	"encoding/json"
	"net/http"

	"../models"
)

func SyncList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	// Decode data
	var list models.List
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	switch r.Method {
		case "POST":
			err := list.Create()

			if err == nil {
				json.NewEncoder(w).Encode(list)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			break
		case "GET":
			list, err := list.Read()

			if err == nil {
				json.NewEncoder(w).Encode(list)
			} else {
				http.Error(w, err.Error(), http.StatusInternalServerError)
			}

			break
		default:
			http.Error(w, "Method Not Allowed", http.StatusMethodNotAllowed)	
	}

	return
}
