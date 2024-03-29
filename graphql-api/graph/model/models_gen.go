// Code generated by github.com/99designs/gqlgen, DO NOT EDIT.

package model

type AUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
	Name     string `json:"name"`
}

type LoginUser struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type NewTodo struct {
	Text string `json:"text"`
}

type NewUser struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

type Todo struct {
	ID   string `json:"id"`
	Text string `json:"text"`
	Done bool   `json:"done"`
	User *User  `json:"user"`
}

type User struct {
	ID   string `json:"id"`
	Name string `json:"name"`
}
