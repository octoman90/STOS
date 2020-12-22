package repository

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../domain/entity"
)

func CreateOneDashboard(dashboard entity.Dashboard) (primitive.ObjectID, error) {
	return primitive.ObjectID{}, nil
}

func ReadOneDashboard(dashboard entity.Dashboard) (entity.Dashboard, error) {
	return entity.Dashboard{
		ID: primitive.ObjectID{},
		Title: "mock",
		Owner: primitive.ObjectID{},
		Users: nil,
		UsersCanEdit: false,
		EveryoneCanView: true,
	}, nil
}

func ReadManyDashboards(dashboard entity.Dashboard) ([]entity.Dashboard, error) {
	return []entity.Dashboard{
		entity.Dashboard{
			ID: primitive.ObjectID{},
			Title: "mock",
			Owner: primitive.ObjectID{},
			Users: nil,
			UsersCanEdit: false,
			EveryoneCanView: true,
		},
	}, nil
}
