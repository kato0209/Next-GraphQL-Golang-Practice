package entity

type User struct {
	UserID int    `db:"user_id"`
	Name   string `db:"name"`
}
