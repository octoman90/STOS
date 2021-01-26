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
	router.HandleFunc("/session", api.CheckSession).Methods("GET")
	router.HandleFunc("/dashboard", api.SyncDashboard).Methods("POST", "GET", "DELETE")
	router.HandleFunc("/dashboards", api.SyncDashboards).Methods("GET")
	router.HandleFunc("/list", api.SyncList).Methods("POST", "DELETE")
	router.HandleFunc("/lists", api.SyncLists).Methods("GET")
	router.HandleFunc("/task", api.SyncTask).Methods("POST", "DELETE")
	router.HandleFunc("/tasks", api.SyncTasks).Methods("POST", "GET")
	router.HandleFunc("/user", api.User).Methods("GET")

	srv := &http.Server{
		Handler: 		router,
		Addr: 			"127.0.0.1:8000",
		WriteTimeout: 	15 * time.Second,
		ReadTimeout:  	15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
