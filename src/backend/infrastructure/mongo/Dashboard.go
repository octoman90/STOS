package repository

import (
	"context"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneDashboard(dashboard entity.Dashboard) (primitive.ObjectID, error) {
	document, err := bson.Marshal(dashboard)
	res, err := dashboardCollection.InsertOne(context.TODO(), document)

	return res.InsertedID.(primitive.ObjectID), err
}

func ReadOneDashboard(dashboard entity.Dashboard) (entity.Dashboard, error) {
	filter, _ := bson.Marshal(dashboard)
	err := dashboardCollection.FindOne(context.TODO(), filter).Decode(&dashboard)

	return dashboard, err
}

func ReadManyDashboards(dashboard entity.Dashboard) ([]entity.Dashboard, error) {
	filter, _ := bson.Marshal(dashboard)
	var dashboards []entity.Dashboard

	cur, err := dashboardCollection.Find(context.TODO(), filter)

	if err == nil {
		for cur.Next(context.TODO()) {
			if err = cur.Decode(&dashboard); err == nil {
				dashboards = append(dashboards, dashboard)
			}
		}
	}

	return dashboards, err
}

func UpdateOneDashboard(refDashboard entity.Dashboard, dashboard entity.Dashboard) error {
	filter, _ := bson.Marshal(refDashboard)
	document, _ := bson.Marshal(dashboard)

	return dashboardCollection.FindOneAndReplace(context.TODO(), filter, document).Decode(&dashboard)
}
