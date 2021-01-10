package ut

import(
	"testing"

	"../pkg/security"
)

func TestHashPasswordMustReturnSalt(t *testing.T) {
	_, salt1 := security.HashPassword("reeee")
	_, salt2 := security.HashPassword("reeee", salt1)

	if salt1 != salt2 {
		t.Errorf("The password hashing function from package \"security\" didn't use same salt.")
	}
}

func TestHashPasswordMustBeConsistent(t *testing.T) {
	hash1, salt1 := security.HashPassword("reeee")
	hash2, _ := security.HashPassword("reeee", salt1)

	if hash1 != hash2 {
		t.Errorf("The password hashing function from package \"security\" isn't consistent.")
	}
}

func TestHashPasswordMustGiveDifferentResultForDifferentPasswords(t *testing.T) {
	hash1, _ := security.HashPassword("pass1", "salt")
	hash2, _ := security.HashPassword("pass2", "salt")

	if hash1 == hash2 {
		t.Errorf("The password hashing function from package \"security\" didn't return different results for different strings.")
	}
}

func TestHashPasswordMustGiveDifferentResultForDifferentSalts(t *testing.T) {
	hash1, _ := security.HashPassword("pass", "salt1")
	hash2, _ := security.HashPassword("pass", "salt2")

	if hash1 == hash2 {
		t.Errorf("The password hashing function from package \"security\" didn't return different results for different salt.")
	}
}

func TestHashPasswordMustGiveSameResultForSamePasswordAndSalt(t *testing.T) {
	hash1, _ := security.HashPassword("pass", "salt")
	hash2, _ := security.HashPassword("pass", "salt")

	if hash1 != hash2 {
		t.Errorf("The password hashing function from package \"security\" didn't return different results for different salt.")
	}
}
