package api

import (
	"encoding/json"
	"net/http"

	"../models"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	type In struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	// Decode data
	var in In
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	// TODO: Validate and process data

	err := models.User{
		Name: 		in.Username,
		Password: 	in.Password,
	}.Create()

	w.Header().Set("Content-Type", "application/json")

	if err == nil {
		json.NewEncoder(w).Encode(map[string]bool{"ok": true})
	} else {
		json.NewEncoder(w).Encode(map[string]bool{"ok": false})
	}
}