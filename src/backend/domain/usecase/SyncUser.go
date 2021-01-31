package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../entity"
	"../../infrastructure/repository"
)

func UpsyncOneUser(id primitive.ObjectID, name string) (bool, entity.User, string) {
	user, err := repository.ReadOneUser(entity.User{
		ID: id,
		Name: name,
	})

	if err == nil {
		return true, user, ""
	} else {
		return false, user, err.Error()
	}
}
