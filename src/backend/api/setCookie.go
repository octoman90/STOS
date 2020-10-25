package api

import (
	"net/http"
	"time"
)

func setCookie(w http.ResponseWriter, name string, value string) {
	cookie := http.Cookie{
		Name: 		name,
		Value: 		value,
		Expires: 	time.Now().AddDate(0, 0, 1),
	}
	
	http.SetCookie(w, &cookie)
}