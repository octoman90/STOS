package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"stos/backend/domain/entity"
	"stos/backend/domain/usecase"
)

func SyncTask(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			switch r.Method {
			case "POST":
				postTask(w, r, user.ID)
			case "GET":
				getTask(w, r, user.ID)
			case "UPDATE":
				updateTask(w, r, user.ID)
			case "DELETE":
				deleteTask(w, r, user.ID)
			}
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"Ok":      ok,
				"Message": message,
			})
		}
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok":      false,
			"Message": "No active session",
		})
	}
}

func postTask(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var task entity.Task
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, task, message := usecase.CreateOneTask(userID, task); ok {
		json.NewEncoder(w).Encode(task)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok":      ok,
			"Message": message,
		})
	}
}

func getTask(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	listIDs, ok := r.URL.Query()["listID"]

	if !ok {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok":      ok,
			"Message": "No dashboard specified",
		})
	}

	listID, _ := primitive.ObjectIDFromHex(listIDs[0])

	if ok, tasks, message := usecase.ReadManyTasks(userID, listID); ok {
		json.NewEncoder(w).Encode(tasks)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok":      ok,
			"Message": message,
		})
	}
}

func updateTask(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var tasks []entity.Task
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&tasks); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, tasks, message := usecase.UpdateManyTasks(userID, tasks); ok {
		json.NewEncoder(w).Encode(tasks)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok":      ok,
			"Message": message,
		})
	}
}

func deleteTask(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var task entity.Task
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&task); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	ok, message := usecase.DeleteOneTask(userID, task)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Ok":      ok,
		"Message": message,
	})
}
