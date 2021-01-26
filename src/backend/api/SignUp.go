package api

import (
	"encoding/json"
	"net/http"

	"../pkg/security"
	"../pkg/cookies"
	"../domain/usecase"
)

func SignUp(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type In struct {
		Username string `json:"username"`
		Password string `json:"password"`
	}

	var in In
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&in); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	ok, user, message := usecase.SignUp(in.Username, in.Password)

	if ok {
		token, _ := security.CreateToken(user.Name, user.ID)
		cookies.SetCookie(w, "token", token)
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": ok,
		"username": user.Name,
		"id": user.ID,
		"message": message,
	})
}
