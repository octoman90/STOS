package api

import (
	"encoding/json"
	"net/http"

	"../models"
	"../formatValidators"
	"../security"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	type In struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type Out struct {
		Ok 			bool 	`json:"ok"`
		Username 	string 	`json:"username"`
		Message 	string 	`json:"message"`
	}

	// Decode data
	var in In
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if !formatValidators.Username(&in.Username) || !formatValidators.Password(&in.Password) {
		http.Error(w, "Illegal username or password format", http.StatusBadRequest)
	}

	_, err := models.User{ Name: in.Username }.Read()
	if err == nil {
		json.NewEncoder(w).Encode(Out{
			Ok: false, 
			Message: "User with this username already exists",
		})
	}

	err = models.User{
		Name: 		in.Username,
		Password: 	in.Password,
	}.Create()

	w.Header().Set("Content-Type", "application/json")

	if err == nil {
		token, _ := security.CreateToken(in.Username)
		setCookie(w, "token", token)

		json.NewEncoder(w).Encode(Out{
			Ok: true,
			Username: in.Username,
		})
	} else {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}