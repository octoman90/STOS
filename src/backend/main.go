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
	router.HandleFunc("/logOut", api.LogOut).Methods("POST")
	router.HandleFunc("/session", api.CheckSession).Methods("GET")
	router.HandleFunc("/dashboard", api.SyncDashboard).Methods("POST", "GET", "UPDATE", "DELETE")
	router.HandleFunc("/list", api.SyncList).Methods("POST", "GET", "UPDATE", "DELETE")
	router.HandleFunc("/lists", api.SyncLists).Methods("POST", "GET", "UPDATE", "DELETE")
	router.HandleFunc("/task", api.SyncTask).Methods("POST", "GET", "UPDATE", "DELETE")
	router.HandleFunc("/tasks", api.SyncTasks).Methods("POST", "GET", "UPDATE", "DELETE")
	router.HandleFunc("/user", api.User).Methods("GET", "UPDATE", "DELETE")

	srv := &http.Server{
		Handler: 		router,
		Addr: 			"127.0.0.1:8000",
		WriteTimeout: 	15 * time.Second,
		ReadTimeout:  	15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}
