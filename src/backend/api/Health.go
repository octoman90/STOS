package api

import (
	"encoding/json"
	"net/http"
)

func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	
	json.NewEncoder(w).Encode(map[string]bool{"ok": true})
}