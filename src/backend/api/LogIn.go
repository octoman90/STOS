package api

import (
	"encoding/json"
	"net/http"

	"../models"
	"../formatValidators"
	"../security"
)

func LogIn(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type In struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	type Out struct {
		Ok 			bool 	`json:"ok"`
		Username 	string 	`json:"username,omitempty"`
		Message 	string 	`json:"message,omitempty"`
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

	user, err := models.User{
		Name: in.Username,
	}.Read()

	if err != nil { // User doesn't exist
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "Username or password is invalid",
		})

		return
	}

	hashedPassword, _ := security.HashPassword(in.Password, user.Salt)

	if hashedPassword != user.HashedPassword { // Password is incorect
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "Username or password is invalid",
		})
	} else {
		token, _ := security.CreateToken(user.Name, user.ID)
		setCookie(w, "token", token)

		json.NewEncoder(w).Encode(Out{
			Ok: true,
			Username: in.Username,
		})
	}
}
