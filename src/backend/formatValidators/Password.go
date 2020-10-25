package formatValidators

func Password(str *string) bool {
	// Check length
	if len(*str) < 5 || len(*str) > 40 {
		return false
	}

	return true
}