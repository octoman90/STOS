package api

import (
	"encoding/json"
	"net/http"

	"stos/backend/domain/usecase"
)

func CheckSession(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		var ok, user, message = usecase.CheckSession(cookie.Value)

		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":       ok,
			"username": user.Name,
			"id":       user.ID,
			"message":  message,
		})
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok":      false,
			"message": "No active session",
		})
	}
}
