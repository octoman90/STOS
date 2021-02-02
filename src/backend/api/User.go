package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/entity"
	"../domain/usecase"
)

func User(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, _, message := usecase.CheckSession(cookie.Value); ok {
			switch r.Method {
				case "GET":
					getUser(w, r)
				case "UPDATE":
					updateUser(w, r)
				case "DELETE":
					deleteUser(w, r)
			}
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
		user := entity.User{
			ID: id,
			Name: name,
		}

		if ok, user, message := usecase.ReadOneUser(user); ok {
			json.NewEncoder(w).Encode(user)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"ok": ok,
				"message": message,
			})
		}
	}
}

func updateUser(w http.ResponseWriter, r *http.Request) {
	var user entity.User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, user, message := usecase.UpdateOneUser(user); ok {
		json.NewEncoder(w).Encode(user)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func deleteUser(w http.ResponseWriter, r *http.Request) {
	var user entity.User
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	ok, message := usecase.DeleteOneUser(user)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Ok": ok,
		"Message": message,
	})
}
