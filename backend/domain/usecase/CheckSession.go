package usecase

import (
	"stos/backend/domain/entity"
	"stos/backend/pkg/security"
)

func CheckSession(cookieValue string) (bool, entity.User, string) {
	if username, id, err := security.ParseToken(cookieValue); err != nil {
		return false, entity.User{}, "Session is invalid"
	} else {
		return true, entity.User{ID: id, Name: username}, ""
	}
}
