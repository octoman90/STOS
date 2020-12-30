package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type List struct {
	ID 			primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Dashboard 	primitive.ObjectID 		`bson:"dashboard,omitempty" json:"dashboard"`
	Index		int 					`bson:"index,omitempty" json:"index"`
	Title 		string 					`bson:"title,omitempty" json:"title"`
}
