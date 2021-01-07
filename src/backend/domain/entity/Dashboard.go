package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type Dashboard struct {
	ID 				primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Title 			string 					`bson:"title,omitempty" json:"title"`
	Owner			primitive.ObjectID 		`bson:"owner,omitempty" json:"owner"`
	Users 			[]primitive.ObjectID 	`bson:"users,omitempty" json:"users"`
	Collaborative 	bool 					`bson:"collaborative,omitempty" json:"collaborative"`
	Public 			bool 					`bson:"public,omitempty" json:"public"`
}
