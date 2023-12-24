package repository

import (
	"github.com/jmoiron/sqlx"
)

type ITodoRepository interface {
}

type todoRepository struct {
	db *sqlx.DB
}

func NewTodoRepository(db *sqlx.DB) ITodoRepository {
	return &todoRepository{db}
}
