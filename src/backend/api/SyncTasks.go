package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/entity"
	"../domain/usecase"
)

func SyncTasks(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			if r.Method == "POST" {
				downsyncTasks(w, r, user.ID)
			} else { // GET
				upsyncTasks(w, r, user.ID)
			}
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"Ok": ok,
				"Message": message,
			})
		}
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": false,
			"Message": "No active session",
		})
	}
}

func downsyncTasks(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var tasks []entity.Task
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, tasks, message := usecase.DownsyncManyTasks(userID, tasks); ok {
		json.NewEncoder(w).Encode(tasks)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func upsyncTasks(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	listIDs, ok := r.URL.Query()["listID"]

	if !ok {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": "No dashboard specified",
		})
	}

	listID, _ := primitive.ObjectIDFromHex(listIDs[0])

	if ok, tasks, message := usecase.UpsyncManyTasks(userID, listID); ok {
		json.NewEncoder(w).Encode(tasks)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}
