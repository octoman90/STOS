package models

import(
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"context"
)

type User struct {
	ID 			primitive.ObjectID 	`bson:"_id" json:"id,omitempty"` 
	Name 		string 				`bson:"name" json:"name"`
	Password 	string 				`bson:"password" json:"password"`
}

var userCollection = db().Collection("users")

func (this User) Create() error {
	document, err := bson.Marshal(this)
	_, err = userCollection.InsertOne(context.TODO(), document)

	return err
}

func (this User) Read() (User, error) {
	filter, _ := bson.Marshal(this)
	err := userCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}