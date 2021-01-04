package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneList(list entity.List) (primitive.ObjectID, error) {
	document, err := bson.Marshal(list)
	res, err := listCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func ReadOneList(list entity.List) (entity.List, error) {
	filter, _ := bson.Marshal(list)
	err := listCollection.FindOne(context.TODO(), filter).Decode(&list)

	return list, err
}

func ReadManyLists(list entity.List) ([]entity.List, error) {
	filter, _ := bson.Marshal(list)
	var lists []entity.List

	cur, err := listCollection.Find(context.TODO(), filter)

	if err == nil {
		for cur.Next(context.TODO()) {
			if err = cur.Decode(&list); err == nil {
				lists = append(lists, list)
			}
		}
	}

	return lists, err
}

func UpdateOneList(list entity.List) error {
	document, _ := bson.Marshal(list)
	var replacedDocument bson.M
	return taskCollection.FindOneAndReplace(context.TODO(), bson.M{"_id": list.ID}, document).Decode(&replacedDocument)
}
