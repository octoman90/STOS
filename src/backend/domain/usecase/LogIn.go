package usecase

import (
	"../entity"
	"../../infrastructure/repository"
	"../../pkg/format"
	"../../pkg/security"
)

func LogIn(username string, password string) (bool, entity.User, string) {
	// Check input format
	if !format.Username(username) || !format.Password(password) {
		return false, entity.User{}, "Illegal username or password format"
	}

	// Read user
	user, err := repository.ReadOneUser(entity.User{
		Name: username,
	})

	if err != nil {
		return false, user, "Username or password is invalid"
	}

	// Check if password hashes match
	hashedPassword, _ := security.HashPassword(password, user.Salt)
	if err != nil || hashedPassword != user.HashedPassword {
		return false, user, "Username or password is invalid"
	} else {
		return true, user, ""
	}
}
