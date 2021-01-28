package cookies

import (
	"net/http"
	"time"
)

func RemoveCookie(w http.ResponseWriter, name string) {
	cookie := http.Cookie{
		Name: 		name,
		Value: 		"",
		Expires: 	time.Now(),
	}

	http.SetCookie(w, &cookie)
}
