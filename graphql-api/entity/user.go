package entity

type User struct {
	UserID   int    `db:"user_id"`
	Name     string `db:"name"`
	Email    string `db:"email"`
	Password string `db:"password"`
}
