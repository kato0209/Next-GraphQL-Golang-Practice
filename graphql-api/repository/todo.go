package repository

import (
	"context"
	"graphql-api/entity"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type ITodoRepository interface {
	CreateTodo(ctx context.Context, todo *entity.Todo) error
}

type todoRepository struct {
	db *sqlx.DB
}

func NewTodoRepository(db *sqlx.DB) ITodoRepository {
	return &todoRepository{db}
}

func (tr *todoRepository) CreateTodo(ctx context.Context, todo *entity.Todo) error {
	query := `INSERT INTO todos (user_id, text, done) VALUES ($1, $2, $3) RETURNING todo_id`
	err := tr.db.QueryRowContext(ctx, query, todo.User.UserID, todo.Text, todo.Done).Scan(&todo.TodoID)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}
