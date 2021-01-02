package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/usecase"
)

func SyncDashboards(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			upsyncDashboards(w, r, user.ID)
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

func upsyncDashboards(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	if ok, dashboards, message := usecase.UpsyncManyDashboards(userID); ok {
		json.NewEncoder(w).Encode(dashboards)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}
