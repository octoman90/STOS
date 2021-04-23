package security

import (
	"stos/backend/domain/entity"
	"stos/backend/infrastructure/repository"
)

var (
	secret, _ = getSecret()
)

func getSecret() ([]byte, error) {
	secret, err := repository.ReadOneMisc(entity.Misc{
		ID: "secret",
	})

	if err == nil {
		return []byte(secret.Value), nil
	} else {
		secret = entity.Misc{
			ID:    "secret",
			Value: randomString(16),
		}

		_, err := repository.CreateOneMisc(secret)

		return []byte(secret.Value), err
	}
}
