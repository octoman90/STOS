package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"stos/backend/domain/entity"
	"stos/backend/infrastructure/repository"
)

func CreateOneList(userID primitive.ObjectID, list entity.List) (bool, entity.List, string) {
	if id, err := repository.CreateOneList(list); err == nil {
		list.ID = id
		return true, list, ""
	} else {
		return false, list, err.Error()
	}
}

func UpsyncManyLists(userID primitive.ObjectID, dashboardID primitive.ObjectID) (bool, []entity.List, string) {
	lists, err := repository.ReadManyLists(entity.List{Dashboard: dashboardID})

	if err == nil {
		return true, lists, ""
	} else {
		return false, lists, err.Error()
	}
}

func UpdateOneList(userID primitive.ObjectID, list entity.List) (bool, entity.List, string) {
	if err := repository.UpdateOneList(entity.List{ID: list.ID}, list); err == nil {
		return true, list, ""
	} else {
		return false, list, err.Error()
	}
}

func DeleteOneList(userID primitive.ObjectID, list entity.List) (bool, string) {
	if err := repository.DeleteOneList(entity.List{ID: list.ID}); err == nil {
		return true, ""
	} else {
		return false, err.Error()
	}
}
