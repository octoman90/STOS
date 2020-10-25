package security

import(
	"errors"

	"github.com/dgrijalva/jwt-go"
)

func ParseToken(tokenString string) (string, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, errors.New("Unexpected signing method.")
		}

		return secret, nil
	})

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		username, _ := claims["Username"].(string)
		return username, nil
	} else {
		return "", err
	}
}