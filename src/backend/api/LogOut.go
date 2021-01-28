package api

import (
	"encoding/json"
	"net/http"

	"../pkg/cookies"
)

func LogOut(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	cookies.RemoveCookie(w, "token")

	json.NewEncoder(w).Encode(map[string]interface{}{
		"ok": true,
	})
}
