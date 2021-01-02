package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/usecase"
)

func SyncLists(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			upsyncLists(w, r, user.ID)
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

func upsyncLists(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
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
