package models

import (
	"context"
	
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID 				primitive.ObjectID 	`bson:"_id,omitempty" json:"id,omitempty"` 
	Name 			string 				`bson:"name,omitempty" json:"name"`
	HashedPassword 	string 				`bson:"hashedPassword,omitempty" json:"hashedPassword"`
	Salt 			string 				`bson:"salt,omitempty" json:"salt"`
}

func (this User) Create() (primitive.ObjectID, error) {
	document, err := bson.Marshal(this)
	res, err := userCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func (this User) Read() (User, error) {
	filter, _ := bson.Marshal(this)
	err := userCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}
