package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type List struct {
	ID 			primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Dashboard 	primitive.ObjectID 		`bson:"dashboardID,omitempty" json:"dashboard"`
	Title 		string 					`bson:"title,omitempty" json:"title"`
}
