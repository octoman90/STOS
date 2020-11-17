package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type List struct {
	ID 		primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Title 	string 					`bson:"title,omitempty" json:"title"`
	Tasks 	primitive.ObjectID[] 	`bson:"lists,omitempty" json:"lists"`
}

func (this List) Create() error {
	document, err := bson.Marshal(this)
	_, err = listCollection.InsertOne(context.TODO(), document)

	return err
}

func (this List) Read() (List, error) {
	filter, _ := bson.Marshal(this)
	err := listCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}
