package ut

import(
	"testing"

	"../pkg/format"
)

func TestPasswordMustDenyShortStrings(t *testing.T) {
	if format.Password("reee") {
		t.Errorf("Package \"format\" allowed a password shorter than 5 characters.")
	}
}

func TestPasswordMustAcceptRightLengthStrings(t *testing.T) {
	if (!format.Password("reeee") || !format.Password("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")) {
		t.Errorf("Package \"format\" denied a password of length between 5 and 40 characters.")
	}
}

func TestPasswordMustDenyLongStrings(t *testing.T) {
	if (format.Password("reeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")) {
		t.Errorf("Package \"format\" allowed a password longer than 40 characters.")
	}
}

func TestUsernameMustDenyShortStrings(t *testing.T) {
	if format.Username("reee") {
		t.Errorf("Package \"format\" allowed a username shorter than 5 characters.")
	}
}

func TestUsernameMustAllowRightLengthStrings(t *testing.T) {
	if (!format.Username("reeee") || !format.Username("reeeeeeeeeeeeeeeeeee")) {
		t.Errorf("Package \"format\" denied a username of length between 5 and 20 characters.")
	}
}

func TestUsernamemystDenyLongStrings(t *testing.T) {
	if (format.Username("reeeeeeeeeeeeeeeeeeee")) {
		t.Errorf("Package \"format\" allowed a username longer than 20 characters.")
	}
}

func TestUsernameMustDenySpecialCharacters(t *testing.T) {
	if (format.Username("reeee@eeeee")) {
		t.Errorf("Package \"format\" allowed a username with a special character.")
	}
}
