package security

import(
	"errors"

	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func ParseToken(tokenString string) (string, primitive.ObjectID, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Unexpected signing method.")
		}

		return secret, nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		id, _ := primitive.ObjectIDFromHex(claims["ID"].(string))
		username, _ := claims["Username"].(string)
		return username, id, nil
	} else {
		return "", primitive.ObjectID{}, err
	}
}
