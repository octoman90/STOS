package main

import (
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"

	"./api"
)

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/signUp", api.SignUp).Methods("POST")
	router.HandleFunc("/logIn", api.LogIn).Methods("POST")
	router.HandleFunc("/checkSession", api.CheckSession).Methods("GET")
	router.HandleFunc("/syncDashboard", api.SyncDashboard).Methods("POST", "GET", "DELETE")
	router.HandleFunc("/syncDashboards", api.SyncDashboards).Methods("GET")
	router.HandleFunc("/syncList", api.SyncList).Methods("POST", "DELETE")
	router.HandleFunc("/syncLists", api.SyncLists).Methods("GET")
	router.HandleFunc("/syncTask", api.SyncTask).Methods("POST")
	router.HandleFunc("/syncTasks", api.SyncTasks).Methods("POST", "GET")

	srv := &http.Server{
		Handler: 		router,
		Addr: 			"127.0.0.1:8000",
		WriteTimeout: 	15 * time.Second,
		ReadTimeout:  	15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
