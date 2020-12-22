package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneUser(user entity.User) (primitive.ObjectID, error) {
	document, err := bson.Marshal(user)
	res, err := userCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func ReadOneUser(user entity.User) (entity.User, error) {
	filter, _ := bson.Marshal(user)
	err := userCollection.FindOne(context.TODO(), filter).Decode(&user)

	return user, err
}
