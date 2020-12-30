package entity

import "go.mongodb.org/mongo-driver/bson/primitive"

type Task struct {
	ID 		primitive.ObjectID 	`bson:"_id,omitempty" json:"id"`
	List 	primitive.ObjectID 	`bson:"list,omitempty" json:"list"`
	Title 	string 				`bson:"title,omitempty" json:"title"`
	Index	int 				`bson:"index,omitempty" json:"index"`
	Modules []string 			`bson:"modules,omitempty" json:"modules"`
}
