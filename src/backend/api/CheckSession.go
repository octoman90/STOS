package api

import (
	"encoding/json"
	"net/http"

	"../domain/usecase"
)

func CheckSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type Out struct {
		Ok 			bool 	`json:"ok"`
		Username 	string 	`json:"username,omitempty"`
		Message 	string 	`json:"message,omitempty"`
	}

	var out Out

	if cookie, err := r.Cookie("token"); err == nil {
		out.Ok, out.Username, _, out.Message = usecase.CheckSession(cookie.Value)
	} else {
		out.Ok = false
		out.Message = "No active session"
	}

	json.NewEncoder(w).Encode(out)
}
