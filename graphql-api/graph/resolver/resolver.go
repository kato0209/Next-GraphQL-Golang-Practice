package resolver

import "graphql-api/usecase"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	tu usecase.ITodoUsecase
}

func NewResolver(todo usecase.ITodoUsecase) *Resolver {
	return &Resolver{
		tu: todo,
	}
}
