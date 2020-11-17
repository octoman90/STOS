package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Dashboard struct {
	ID 		primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Title 	string 					`bson:"title,omitempty" json:"title"`
	Users 	[]primitive.ObjectID 	`bson:"users,omitempty" json:"users"`
	Lists 	[]primitive.ObjectID 	`bson:"lists,omitempty" json:"lists"`
}

func (this Dashboard) Create() error {
	document, err := bson.Marshal(this)
	_, err = dashboardCollection.InsertOne(context.TODO(), document)

	return err
}

func (this Dashboard) Read() (Dashboard, error) {
	filter, _ := bson.Marshal(this)
	err := dashboardCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}
