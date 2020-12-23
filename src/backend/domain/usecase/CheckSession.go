package usecase

import (
	"../../pkg/security"
	"../entity"
)

func CheckSession(cookieValue string) (bool, entity.User, string) {
	if username, id, err := security.ParseToken(cookieValue); err != nil {
		return false, entity.User{ ID: id, Name: username }, "Session is invalid"
	} else {
		return true, entity.User{}, ""
	}
}
