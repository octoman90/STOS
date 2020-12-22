package api

import (
	"net/http"
)

func SyncTask(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "Tasc syncing is not implemented", http.StatusInternalServerError)

	return
}
