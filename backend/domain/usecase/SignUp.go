package usecase

import (
	"stos/backend/domain/entity"
	"stos/backend/infrastructure/repository"
	"stos/backend/pkg/format"
	"stos/backend/pkg/security"
)

func SignUp(username string, password string) (bool, entity.User, string) {
	// Check input format
	if !format.Username(username) || !format.Password(password) {
		return false, entity.User{}, "Illegal username or password format"
	}

	user := entity.User{Name: username}

	// Check if username is already in use
	if _, err := repository.ReadOneUser(user); err == nil {
		return false, entity.User{}, "User with this username already exists"
	}

	// Hash the password
	user.HashedPassword, user.Salt = security.HashPassword(password)

	// Create
	if id, err := repository.CreateOneUser(user); err == nil {
		return false, entity.User{}, err.Error()
	} else {
		user.ID = id
		return true, user, ""
	}
}
