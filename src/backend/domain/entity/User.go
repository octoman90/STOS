package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID 				primitive.ObjectID 	`bson:"_id,omitempty" json:"id,omitempty"`
	Name 			string 				`bson:"name,omitempty" json:"name"`
	HashedPassword 	string 				`bson:"hashedPassword,omitempty" json:"hashedPassword"`
	Salt 			string 				`bson:"salt,omitempty" json:"salt"`
}
