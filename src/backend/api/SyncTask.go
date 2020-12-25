package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/entity"
	"../domain/usecase"
)

func SyncTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			if r.Method == "POST" {
				downsyncTask(w, r, user.ID)
			} else { // GET
				upsyncTask(w, r, user.ID)
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

func downsyncTask(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var task entity.Task
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, task, message := usecase.DownsyncOneTask(userID, task); ok {
		json.NewEncoder(w).Encode(task)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func upsyncTask(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
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
