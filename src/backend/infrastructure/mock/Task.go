package repository

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneTask(task entity.Task) (primitive.ObjectID, error) {
	return primitive.ObjectID{}, nil
}

func ReadOneTask(task entity.Task) (entity.Task, error) {
	return entity.Task{
		ID: primitive.ObjectID{},
		List: primitive.ObjectID{},
		Title: "mock",
		Modules: []string{""},
	}, nil
}
