package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"stos/backend/domain/entity"
	"stos/backend/infrastructure/repository"
)

func CreateOneTask(userID primitive.ObjectID, task entity.Task) (bool, entity.Task, string) {
	if id, err := repository.CreateOneTask(task); err == nil {
		task.ID = id
		return true, task, ""
	} else {
		return false, task, err.Error()
	}
}

func ReadManyTasks(userID primitive.ObjectID, listID primitive.ObjectID) (bool, []entity.Task, string) {
	tasks, err := repository.ReadManyTasks(entity.Task{List: listID})

	if err == nil {
		return true, tasks, ""
	} else {
		return false, tasks, err.Error()
	}
}

func UpdateManyTasks(userID primitive.ObjectID, tasks []entity.Task) (bool, []entity.Task, string) {
	for _, task := range tasks {
		if err := repository.UpdateOneTask(entity.Task{ID: task.ID}, task); err != nil {
			return false, tasks, err.Error()
		}
	}

	return true, tasks, ""
}

func DeleteOneTask(userID primitive.ObjectID, task entity.Task) (bool, string) {
	if err := repository.DeleteOneTask(entity.Task{ID: task.ID}); err == nil {
		return true, ""
	} else {
		return false, err.Error()
	}
}
