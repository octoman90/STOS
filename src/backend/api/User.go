package api

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
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
	var id primitive.ObjectID
	var name string
	atLeastOne := false

	if ids, ok := r.URL.Query()["id"]; ok {
		atLeastOne = true
		id, _ = primitive.ObjectIDFromHex(ids[0])
	}

	if usernames, ok := r.URL.Query()["username"]; ok {
		atLeastOne = true
		name = usernames[0]
	}

	if !atLeastOne {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": false,
			"Message": "No parameters specified",
		})
	} else {
		if ok, user, message := usecase.UpsyncOneUser(id, name); ok {
			json.NewEncoder(w).Encode(user)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"ok": ok,
				"message": message,
			})
		}
	}
}
