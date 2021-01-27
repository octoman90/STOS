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
				list = entity.List{}
			}
		}
	}

	return lists, err
}

func UpdateOneList(refList entity.List, list entity.List) error {
	filter, _ := bson.Marshal(refList)
	document, _ := bson.Marshal(list)
	return listCollection.FindOneAndReplace(context.TODO(), filter, document).Decode(&list)
}

func DeleteManyLists(list entity.List) error {
	filter, _ := bson.Marshal(list)
	cur, err := listCollection.Find(context.TODO(), filter)

	if err == nil {
		for cur.Next(context.TODO()) {
			var l entity.List
			if err = cur.Decode(&l); err == nil {
				f, _ := bson.Marshal(l)
				_, err = listCollection.DeleteOne(context.TODO(), f)
				_ = DeleteManyTasks(entity.Task{ List: l.ID })
			} else {
				return err
			}
		}
	}

	return err
}

func DeleteOneList(list entity.List) error {
	filter, _ := bson.Marshal(list)
	err := listCollection.FindOneAndDelete(context.TODO(), filter).Decode(&list)
	_ = DeleteManyTasks(entity.Task{ List: list.ID })
	return err
}
