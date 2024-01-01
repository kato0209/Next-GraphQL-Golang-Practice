package resolver

import "graphql-api/usecase"

// This file will not be regenerated automatically.
//
// It serves as dependency injection for your app, add any dependencies you require here.

type Resolver struct {
	tu usecase.ITodoUsecase
	uu usecase.IUserUsecase
}

func NewResolver(todo usecase.ITodoUsecase, user usecase.IUserUsecase) *Resolver {
	return &Resolver{
		tu: todo,
		uu: user,
	}
}
