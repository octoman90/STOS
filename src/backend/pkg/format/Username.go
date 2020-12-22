package format

import (
	"regexp"
)

func Username(str string) bool {
	// Check length
	if len(str) < 5 || len(str) > 20 {
		return false
	}

	// Check for illegal symbols
	if !regexp.MustCompile(`^[A-Za-z0-9_]+$`).MatchString(str) {
		return false
	}

	return true
}
