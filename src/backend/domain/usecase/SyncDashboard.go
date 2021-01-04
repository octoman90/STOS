package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../entity"
	"../../infrastructure/repository"
)

func UpsyncManyDashboards(userID primitive.ObjectID) (bool, []entity.Dashboard, string) {
	dashboards, err := repository.ReadManyDashboards(entity.Dashboard{
		Owner: userID,
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
		Owner: userID,
	})

	if err == nil {
		return true, dashboard, ""
	} else {
		return false, dashboard, err.Error()
	}
}

func DownsyncOneDashboard(userID primitive.ObjectID, dashboard entity.Dashboard) (bool, entity.Dashboard, string) {
	if dashboard.ID != primitive.NilObjectID {
		if err := repository.UpdateOneDashboard(dashboard); err == nil {
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
