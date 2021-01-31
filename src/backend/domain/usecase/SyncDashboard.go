package usecase

import (
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../entity"
	"../../infrastructure/repository"
)

func UpsyncManyDashboards(userID primitive.ObjectID) (bool, []entity.Dashboard, string) {
	dashboards, err := repository.ReadManyDashboards(bson.M{
		"$or": []bson.M{
			bson.M{"ownerID": userID},
			bson.M{"userIDs": userID},
		},
	})

	if err == nil {
		return true, dashboards, ""
	} else {
		return false, dashboards, err.Error()
	}
}

func UpsyncOneDashboard(userID primitive.ObjectID, dashboardID primitive.ObjectID) (bool, entity.Dashboard, string) {
	dashboard, err := repository.ReadOneDashboard(entity.Dashboard{
		ID: dashboardID,
	})

	if err == nil {
		return true, dashboard, ""
	} else {
		return false, dashboard, err.Error()
	}
}

func DownsyncOneDashboard(userID primitive.ObjectID, dashboard entity.Dashboard) (bool, entity.Dashboard, string) {
	if dashboard.ID != primitive.NilObjectID {
		if err := repository.UpdateOneDashboard(entity.Dashboard{
			ID: dashboard.ID,
		}, dashboard); err == nil {
			return true, dashboard, ""
		} else {
			return false, dashboard, err.Error()
		}
	} else {
		dashboard.Owner = userID

		if id, err := repository.CreateOneDashboard(dashboard); err == nil {
			dashboard.ID = id
			return true, dashboard, ""
		} else {
			return false, dashboard, err.Error()
		}
	}
}

func DeleteOneDashboard(userID primitive.ObjectID, dashboard entity.Dashboard) (bool, string) {
	if err := repository.DeleteOneDashboard(entity.Dashboard{ ID: dashboard.ID }); err == nil {
		return true, ""
	} else {
		return false, err.Error()
	}
}
