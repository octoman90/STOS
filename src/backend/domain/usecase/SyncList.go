package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../entity"
	"../../infrastructure/repository"
)

func DownsyncOneList(userID primitive.ObjectID, list entity.List) (bool, entity.List, string) {
	if id, err := repository.CreateOneList(list); err == nil {
		list.ID = id
		return true, list, ""
	} else {
		return false, list, err.Error()
	}
}
