package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"stos/backend/domain/entity"
)

func CreateOneTask(task entity.Task) (primitive.ObjectID, error) {
	document, err := bson.Marshal(task)
	res, err := taskCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func ReadManyTasks(task entity.Task) ([]entity.Task, error) {
	filter, _ := bson.Marshal(task)
	var tasks []entity.Task

	cur, err := taskCollection.Find(context.TODO(), filter)

	if err == nil {
		for cur.Next(context.TODO()) {
			if err = cur.Decode(&task); err == nil {
				tasks = append(tasks, task)
				task = entity.Task{}
			}
		}
	}

	return tasks, err
}

func UpdateOneTask(refTask entity.Task, task entity.Task) error {
	filter, _ := bson.Marshal(refTask)
	document, _ := bson.Marshal(task)

	var t entity.Task
	return taskCollection.FindOneAndReplace(context.TODO(), filter, document).Decode(&t)
}

func DeleteManyTasks(task entity.Task) error {
	filter, _ := bson.Marshal(task)
	_, err := taskCollection.DeleteMany(context.TODO(), filter)
	return err
}

func DeleteOneTask(task entity.Task) error {
	filter, _ := bson.Marshal(task)
	_, err := taskCollection.DeleteOne(context.TODO(), filter)
	return err
}
