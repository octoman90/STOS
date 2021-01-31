package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type Dashboard struct {
	ID 				primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Title 			string 					`bson:"title,omitempty" json:"title"`
	Owner			primitive.ObjectID 		`bson:"ownerID,omitempty" json:"ownerID"`
	Users 			[]primitive.ObjectID 	`bson:"userIDs,omitempty" json:"userIDs"`
	Collaborative 	bool 					`bson:"collaborative,omitempty" json:"collaborative"`
}
