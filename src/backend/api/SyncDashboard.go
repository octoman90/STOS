package api

import (
	"encoding/json"
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"

	"../models"
	"../security"
)

func SyncDashboard(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	type Out struct {
		Ok 			bool 	`json:"ok"`
		Message 	string 	`json:"message"`
	}

	cookie, err := r.Cookie("token")
	if err != nil {
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "No active session",
		})

		return
	}

	_, id, err := security.ParseToken(cookie.Value)
	if err != nil {
		json.NewEncoder(w).Encode(Out{
			Ok: false,
			Message: "Session is invalid",
		})

		return
	}

	if r.Method == "POST" {
		downsyncDashboard(w, r, id)
	} else { // GET
		upsyncDashboard(w, r, id)
	}
}

func upsyncDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	ids, ok := r.URL.Query()["id"]

	if !ok || len(ids[0]) < 1 { // No dashboard specified
		dashboards, err := models.Dashboard{
			Owner: userID,
		}.ReadMany()
		
		if err == nil {
			json.NewEncoder(w).Encode(dashboards)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	} else {
		var dashboardID primitive.ObjectID
		err := dashboardID.UnmarshalJSON([]byte(ids[0]))

		if err != nil {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}

		dashboard, err := models.Dashboard{
			ID: dashboardID,
			Owner: userID,
		}.Read()

		if err == nil {
			json.NewEncoder(w).Encode(dashboard)
		} else {
			http.Error(w, err.Error(), http.StatusInternalServerError)
		}
	}
}

func downsyncDashboard(w http.ResponseWriter, r *http.Request, userID primitive.ObjectID) {
	// Decode data
	var dashboard models.Dashboard
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&dashboard); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}

	dashboard.Owner = userID

	id, err := dashboard.Create()

	if err == nil {
		dashboard.ID = id
		json.NewEncoder(w).Encode(dashboard)
	} else {
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}
