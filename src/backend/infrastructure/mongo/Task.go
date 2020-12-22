package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneTask(task entity.Task) (primitive.ObjectID, error) {
	document, err := bson.Marshal(task)
	res, err := taskCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func ReadOneTask(task entity.Task) (entity.Task, error) {
	filter, _ := bson.Marshal(task)
	err := taskCollection.FindOne(context.TODO(), filter).Decode(&task)

	return task, err
}
