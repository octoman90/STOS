package usecase

import (
	"go.mongodb.org/mongo-driver/bson/primitive"

	"../../pkg/security"
)

func CheckSession(cookieValue string) (bool, string, primitive.ObjectID, string) {
	if username, id, err := security.ParseToken(cookieValue); err != nil {
		return false, username, id, "Session is invalid"
	} else {
		return true, username, id, ""
	}
}
