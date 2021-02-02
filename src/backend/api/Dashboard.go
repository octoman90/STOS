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

	if cookie, err := r.Cookie("token"); err == nil {
		if ok, user, message := usecase.CheckSession(cookie.Value); ok {
			switch r.Method {
				case "POST":
					postDashboard(w, r, user.ID)
				case "GET":
					getDashboard(w, r, user.ID)
				case "UPDATE":
					updateDashboard(w, r, user.ID)
				case "DELETE":
					deleteDashboard(w, r, user.ID)
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

func postDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var dashboard entity.Dashboard
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&dashboard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, dashboard, message := usecase.CreateOneDashboard(userID, dashboard); ok {
		json.NewEncoder(w).Encode(dashboard)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func getDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	dashboardIDs, ok := r.URL.Query()["id"]

	if ok && len(dashboardIDs[0]) >= 1 { // Give the specified dashboard
		dashboardID, _ := primitive.ObjectIDFromHex(dashboardIDs[0])

		if ok, dashboard, message := usecase.UpsyncOneDashboard(userID, dashboardID); ok {
			json.NewEncoder(w).Encode(dashboard)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"Ok": ok,
				"Message": message,
			})
		}
	} else { // Give all dashboards current user has access to
		if ok, dashboards, message := usecase.UpsyncManyDashboards(userID); ok {
			json.NewEncoder(w).Encode(dashboards)
		} else {
			json.NewEncoder(w).Encode(map[string]interface{}{
				"Ok": ok,
				"Message": message,
			})
		}
	}
}

func updateDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var dashboard entity.Dashboard
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&dashboard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	if ok, dashboard, message := usecase.UpdateOneDashboard(userID, dashboard); ok {
		json.NewEncoder(w).Encode(dashboard)
	} else {
		json.NewEncoder(w).Encode(map[string]interface{}{
			"Ok": ok,
			"Message": message,
		})
	}
}

func deleteDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	var dashboard entity.Dashboard
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&dashboard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	ok, message := usecase.DeleteOneDashboard(userID, dashboard)
	json.NewEncoder(w).Encode(map[string]interface{}{
		"Ok": ok,
		"Message": message,
	})
}
