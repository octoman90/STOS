package entity

type Misc struct {
	ID 		string `bson:"_id"`
	Value 	string `bson:"value,omitempty"`
}
