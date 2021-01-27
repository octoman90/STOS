package api

import (
	"encoding/json"
	"net/http"

	"../domain/usecase"
)

func User(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, _, message := usecase.CheckSession(cookie.Value); ok {
			getUser(w, r)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"ok": ok,
				"message": message,
			})
		}
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"ok": false,
			"message": "No active session",
		})
	}
}

func getUser(w http.ResponseWriter, r *http.Request) {
	usernames, ok := r.URL.Query()["username"]

	if !ok || len(usernames[0]) < 1 {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": false,
			"Message": "No username specified",
		})
	} else {
		username := usernames[0]

		if ok, user, message := usecase.UpsyncOneUser(username); ok {
			json.NewEncoder(w).Encode(user)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"ok": ok,
				"message": message,
			})
		}
	}
}
