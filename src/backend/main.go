package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/gorilla/mux"

	"./api"
)

type spaHandler struct {
	staticPath string
	indexPath  string
}

func (h spaHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path, err := filepath.Abs(r.URL.Path)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}

	path = filepath.Join(h.staticPath, path)

	_, err = os.Stat(path)
	if os.IsNotExist(err) {
		http.ServeFile(w, r, filepath.Join(h.staticPath, h.indexPath))
		return
	} else if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	http.FileServer(http.Dir(h.staticPath)).ServeHTTP(w, r)
}

func main() {
	router := mux.NewRouter()

	router.HandleFunc("/api/health", api.Health)
	router.HandleFunc("/api/signUp", api.SignUp)
	router.HandleFunc("/api/logIn", api.LogIn)
	router.HandleFunc("/api/checkSession", api.CheckSession)
	router.PathPrefix("/").Handler(spaHandler{staticPath: "build", indexPath: "index.html"})

	srv := &http.Server{
		Handler: 		router,
		Addr: 			"127.0.0.1:8000",
		WriteTimeout: 	15 * time.Second,
		ReadTimeout:  	15 * time.Second,
	}

	log.Fatal(srv.ListenAndServe())
}