package security

import (
	"crypto/sha256"
)

func HashPassword(params ...string) (string, string) {
	password := params[0]
	var salt string

	if len(params) < 2 {
		salt = randomString(8)
	} else {
		salt = params[1]
	}

	h := sha256.New()
	h.Write([]byte(password + salt))

	return string(h.Sum(nil)), salt
}
