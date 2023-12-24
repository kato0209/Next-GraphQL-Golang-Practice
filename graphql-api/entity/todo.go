package entity

type Todo struct {
	TodoID int    `db:"todo_id"`
	Text   string `db:"text"`
	Done   bool   `db:"done"`
	User   User
}
