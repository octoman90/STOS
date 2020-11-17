package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Task struct {
	ID 		primitive.ObjectID 	`bson:"_id,omitempty" json:"id"`
	Title 	string 				`bson:"title,omitempty" json:"title"`
	Modules []string 			`bson:"modules,omitempty" json:"modules"`
}

func (this Task) Create() error {
	document, err := bson.Marshal(this)
	_, err = taskCollection.InsertOne(context.TODO(), document)

	return err
}

func (this Task) Read() (Task, error) {
	filter, _ := bson.Marshal(this)
	err := taskCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}
