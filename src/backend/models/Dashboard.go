package models

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Dashboard struct {
	ID 				primitive.ObjectID 		`bson:"_id,omitempty" json:"id"`
	Title 			string 					`bson:"title,omitempty" json:"title"`
	Owner			primitive.ObjectID 		`bson:"owner,omitempty" json:"owner"`
	Users 			[]primitive.ObjectID 	`bson:"users,omitempty" json:"users"`
	Lists 			[]primitive.ObjectID 	`bson:"lists,omitempty" json:"lists"`
	UsersCanEdit 	bool 					`bson:"usersCanEdit,omitempty" json:"usersCanEdit"`
	EveryoneCanView bool 					`bson:"everyoneCanView,omitempty" json:"everyoneCanView"`
}

func (this Dashboard) Create() (primitive.ObjectID, error) {
	document, err := bson.Marshal(this)
	res, err := dashboardCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func (this Dashboard) Read() (Dashboard, error) {
	filter, _ := bson.Marshal(this)
	err := dashboardCollection.FindOne(context.TODO(), filter).Decode(&this)

	return this, err
}

func (this Dashboard) ReadMany() ([]Dashboard, error) {
	filter, _ := bson.Marshal(this)
	var dashboards []Dashboard

	cur, err := dashboardCollection.Find(context.TODO(), filter)
	
	if err == nil {
		for cur.Next(context.TODO()) {
			var dashboard Dashboard

			if err = cur.Decode(&dashboard); err == nil {
				dashboards = append(dashboards, dashboard)
			}
		}
	}

	return dashboards, err
}
