package api

import (
	"encoding/json"
	"net/http"

	"../security"
)

func CheckSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type Out struct {
		Ok 			bool 	`json:"ok"`
		Username 	string 	`json:"username"`
		Message 	string 	`json:"message"`
	}

	cookie, err := r.Cookie("token")
	if err != nil {
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "No active session",
		})

		return
	}

	username, err := security.ParseToken(cookie.Value)
	if err != nil {
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "Session is invalid",
		})
	} else {
		json.NewEncoder(w).Encode(Out{
			Ok: true,
			Username: username,
		})
	}

}
