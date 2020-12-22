package repository

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneList(list entity.List) (primitive.ObjectID, error) {
	return primitive.ObjectID{}, nil
}

func ReadOneList(list entity.List) (entity.List, error) {
	return entity.List{
		ID: primitive.ObjectID{},
		Dashboard: primitive.ObjectID{},
		Title: "mock",
	}, nil
}

func ReadManyLists(list entity.List) ([]entity.List, error) {
	return []entity.List{
		entity.List{
			ID: primitive.ObjectID{},
			Dashboard: primitive.ObjectID{},
			Title: "mock",
		},
	}, nil
}
