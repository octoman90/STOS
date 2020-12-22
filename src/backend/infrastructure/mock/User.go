package repository

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneUser(user entity.User) (primitive.ObjectID, error) {
	return primitive.ObjectID{}, nil
}

func ReadOneUser(user entity.User) (entity.User, error) {
	return entity.User{
		ID: primitive.ObjectID{},
		Name: "mock",
		HashedPassword: "mock",
		Salt: "mock",
	}, nil
}
