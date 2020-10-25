package security

import (
	"../models"
)

var (
	secret, _ = getSecret()
)

func getSecret() ([]byte, error) {
	secret, err := models.Secret{}.Read()

	if err == nil {
		return []byte(secret.Value), nil
	} else {
		generatedSecret := randomString(16)
		err := models.Secret{
			Value: generatedSecret,
		}.Create()

		return []byte(generatedSecret), err
	}
}