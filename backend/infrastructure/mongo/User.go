package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"stos/backend/domain/entity"
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

func UpdateOneUser(refUser entity.User, user entity.User) error {
	filter, _ := bson.Marshal(refUser)
	document, _ := bson.Marshal(user)

	var u entity.User
	return userCollection.FindOneAndReplace(context.TODO(), filter, document).Decode(&u)
}

func DeleteOneUser(user entity.User) error {
	filter, _ := bson.Marshal(user)
	_, err := userCollection.DeleteOne(context.TODO(), filter)
	_ = DeleteManyDashboards(entity.Dashboard{Owner: user.ID})

	return err
}
