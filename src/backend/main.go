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

	router.HandleFunc("/signUp", api.SignUp)
	router.HandleFunc("/logIn", api.LogIn)
	router.HandleFunc("/checkSession", api.CheckSession)

	srv := &http.Server{
		Handler: 		router,
		Addr: 			"127.0.0.1:8000",
		WriteTimeout: 	15 * time.Second,
		ReadTimeout:  	15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}