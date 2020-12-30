package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../entity"
	"../../infrastructure/repository"
)

func DownsyncOneTask(userID primitive.ObjectID, task entity.Task) (bool, entity.Task, string) {
	if id, err := repository.CreateOneTask(task); err == nil {
		task.ID = id
		return true, task, ""
	} else {
		return false, task, err.Error()
	}
}

func UpsyncManyTasks(userID primitive.ObjectID, listID primitive.ObjectID) (bool, []entity.Task, string) {
	tasks, err := repository.ReadManyTasks(entity.Task{
		List: listID,
	})

	if err == nil {
		return true, tasks, ""
	} else {
		return false, tasks, err.Error()
	}
}

// func DownsyncManyTasks(userID primitive.ObjectID, task []entity.Task) (bool, []entity.Task, string) {
//
// }
