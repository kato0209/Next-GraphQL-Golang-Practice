package repository

import (
	"context"
	"graphql-api/entity"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type ITodoRepository interface {
	CreateTodo(ctx context.Context, todo *entity.Todo) error
	GetAllTodos(ctx context.Context, todos *[]entity.Todo) error
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

func (tr *todoRepository) GetAllTodos(ctx context.Context, todos *[]entity.Todo) error {
	query := `SELECT 
				todos.todo_id,
				todos.text,
				todos.done,
				users.user_id,
				users.name
			FROM 
				todos
			INNER JOIN 
				users ON todos.user_id = users.user_id;`
	rows, err := tr.db.QueryContext(ctx, query)
	if err != nil {
		return errors.WithStack(err)
	}
	defer rows.Close()

	for rows.Next() {
		todo := entity.Todo{}
		err := rows.Scan(
			&todo.TodoID,
			&todo.Text,
			&todo.Done,
			&todo.User.UserID,
			&todo.User.Name,
		)
		if err != nil {
			return errors.WithStack(err)
		}
		*todos = append(*todos, todo)
	}
	if err := rows.Err(); err != nil {
		return errors.WithStack(err)
	}

	return nil
}
