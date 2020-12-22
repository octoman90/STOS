package repository

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneSecret(secret entity.Secret) (primitive.ObjectID, error) {
	return primitive.ObjectID{}, nil
}

func ReadOneSecret(secret entity.Secret) (entity.Secret, error) {
	return entity.Secret{
		ID: "secret",
		Value: "mock",
	}, nil
}
