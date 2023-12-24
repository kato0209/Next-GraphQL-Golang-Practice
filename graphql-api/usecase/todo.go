package usecase

import "graphql-api/repository"

type ITodoUsecase interface {
}

type todoUsecase struct {
	tr repository.ITodoRepository
}

func NewTodoUsecase(br repository.ITodoRepository) ITodoUsecase {
	return &todoUsecase{br}
}
