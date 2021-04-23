package security

import (
	"time"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func CreateToken(username string, id primitive.ObjectID) (string, error) {
	tokenString := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"Username": username,
		"ID": id.Hex(),
		"IssuedAt": time.Now().Unix(),
	})

	return tokenString.SignedString(secret)
}
