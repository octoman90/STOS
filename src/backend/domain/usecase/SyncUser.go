package usecase

import (
	"../entity"
	"../../infrastructure/repository"
)

func UpsyncOneUser(name string) (bool, entity.User, string) {
	user, err := repository.ReadOneUser(entity.User{
		Name: name,
	})

	if err == nil {
		return true, user, ""
	} else {
		return false, user, err.Error()
	}
}
