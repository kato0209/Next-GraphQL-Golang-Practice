package usecase

import (
	"context"
	"graphql-api/entity"
	"graphql-api/repository"

	"github.com/pkg/errors"
)

type ITodoUsecase interface {
	CreateTodo(ctx context.Context, todo *entity.Todo) error
}

type todoUsecase struct {
	tr repository.ITodoRepository
	ur repository.IUserRepository
}

func NewTodoUsecase(br repository.ITodoRepository, ur repository.IUserRepository) ITodoUsecase {
	return &todoUsecase{br, ur}
}

func (tu *todoUsecase) CreateTodo(ctx context.Context, todo *entity.Todo) error {
	err := tu.tr.CreateTodo(ctx, todo)
	if err != nil {
		return errors.WithStack(err)
	}

	user, err := tu.ur.GetUserByID(todo.User.UserID)
	if err != nil {
		return errors.WithStack(err)
	}

	todo.User = user

	return nil
}
