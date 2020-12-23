package api

import (
	"net/http"
)

func SyncTask(w http.ResponseWriter, r *http.Request) {
	http.Error(w, "Task syncing is not implemented", http.StatusInternalServerError)

	return
}
