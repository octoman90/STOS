package security

import (
	"time"
	
	"github.com/dgrijalva/jwt-go"
)

func CreateToken(username string) (string, error) {
	tokenString := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"Username": username,
		"IssuedAt": time.Now().Unix(),
	})

	return tokenString.SignedString(secret)
}