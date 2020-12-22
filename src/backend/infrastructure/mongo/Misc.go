package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneMisc(misc entity.Misc) (primitive.ObjectID, error) {
	document, err := bson.Marshal(misc)
	res, err := miscCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func ReadOneMisc(misc entity.Misc) (entity.Misc, error) {
	filter, _ := bson.Marshal(misc)
	err := miscCollection.FindOne(context.TODO(), filter).Decode(&misc)

	return misc, err
}
