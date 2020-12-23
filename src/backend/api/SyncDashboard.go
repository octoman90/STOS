package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../domain/entity"
	"../domain/usecase"
)

func SyncDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type Out struct {
		Ok 			bool 	`json:"ok"`
		Message 	string 	`json:"message"`
	}

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			if r.Method == "POST" {
				downsyncDashboard(w, r, user.ID)
			} else { // GET
				upsyncDashboard(w, r, user.ID)
			}
		} else {
			json.NewEncoder(w).Encode(Out{
				Ok: false,
				Message: message,
			})
		}
	} else {
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "No active session",
		})
	}
}

func upsyncDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	dashboardIDs, ok := r.URL.Query()["id"]

	if !ok || len(dashboardIDs[0]) < 1 { // No dashboard specified
		if ok, dashboards, message := usecase.UpsyncManyDashboards(userID); ok {
			json.NewEncoder(w).Encode(dashboards)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"Ok": ok,
				"Message": message,
			})
		}
	} else {
		var dashboardID primitive.ObjectID
		if err := dashboardID.UnmarshalJSON([]byte(dashboardIDs[0])); err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		if ok, dashboard, message := usecase.UpsyncOneDashboard(userID, dashboardID); ok {
			json.NewEncoder(w).Encode(dashboard)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"Ok": ok,
				"Message": message,
			})
		}
	}
}

func downsyncDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var dashboard entity.Dashboard
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&dashboard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	dashboard.Owner = userID

	if ok, dashboard, message := usecase.DownsyncOneDashboard(userID, dashboard); ok {
		json.NewEncoder(w).Encode(dashboard)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}
