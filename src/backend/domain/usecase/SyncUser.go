package usecase

import (
	"../entity"
	"../../infrastructure/repository"
)

func ReadOneUser(user entity.User) (bool, entity.User, string) {
	if user, err := repository.ReadOneUser(user); err == nil {
		return true, user, ""
	} else {
		return false, user, err.Error()
	}
}

func UpdateOneUser(user entity.User) (bool, entity.User, string) {
	if err := repository.UpdateOneUser(entity.User{ ID: user.ID }, user); err == nil {
		return true, user, ""
	} else {
		return false, user, err.Error()
	}
}

func DeleteOneUser(user entity.User) (bool, string) {
	if err := repository.DeleteOneUser(user); err == nil {
		return true, ""
	} else {
		return false, err.Error()
	}
}
