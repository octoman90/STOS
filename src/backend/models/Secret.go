package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
)

type Secret struct {
	ID 		string `bson:"_id" json:"id,omitempty"` 
	Value 	string `bson:"name" json:"name"`
}

func (this Secret) Create() error {
	this.ID = "secret"
	document, err := bson.Marshal(this)
	_, err = miscCollection.InsertOne(context.TODO(), document)

	return err
}

func (this Secret) Read() (Secret, error) {
	this.ID = "secret"
	filter, _ := bson.Marshal(this)
	err := miscCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}