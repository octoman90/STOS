package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/entity"
	"../domain/usecase"
)

func SyncList(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			switch r.Method {
				case "POST":
					postList(w, r, user.ID)
				case "GET":
					getList(w, r, user.ID)
				case "UPDATE":
					updateList(w, r, user.ID)
				case "DELETE":
					deleteList(w, r, user.ID)
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

func postList(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var list entity.List
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, list, message := usecase.CreateOneList(userID, list); ok {
		json.NewEncoder(w).Encode(list)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func getList(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	dashboardIDs, ok := r.URL.Query()["dashboardID"]

	if !ok {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": "No dashboard specified",
		})
	}

	dashboardID, _ := primitive.ObjectIDFromHex(dashboardIDs[0])

	if ok, lists, message := usecase.UpsyncManyLists(userID, dashboardID); ok {
		json.NewEncoder(w).Encode(lists)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func updateList(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var list entity.List
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, list, message := usecase.UpdateOneList(userID, list); ok {
		json.NewEncoder(w).Encode(list)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func deleteList(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var list entity.List
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&list); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	ok, message := usecase.DeleteOneList(userID, list)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Ok": ok,
		"Message": message,
	})
}
