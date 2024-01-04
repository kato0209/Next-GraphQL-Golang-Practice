package resolver

// This file will be automatically regenerated based on the schema, any resolver implementations
// will be copied through when generating and any unknown code will be moved to the end.
// Code generated by github.com/99designs/gqlgen version v0.17.41

import (
	"context"
	"graphql-api/entity"
	"graphql-api/graph/model"
	"strconv"
)

// CreateTodo is the resolver for the createTodo field.
func (r *mutationResolver) CreateTodo(ctx context.Context, input model.NewTodo) (*model.Todo, error) {
	userID, err := strconv.Atoi(ctx.Value("user_id").(string))
	if err != nil {
		return nil, err
	}

	todo := &entity.Todo{
		Text: input.Text,
		Done: false,
		User: entity.User{
			UserID: userID,
		},
	}

	err = r.tu.CreateTodo(ctx, todo)
	if err != nil {
		return nil, err
	}

	resTodo := &model.Todo{
		ID:   strconv.Itoa(todo.TodoID),
		Text: todo.Text,
		Done: todo.Done,
		User: &model.User{
			ID:   strconv.Itoa(todo.User.UserID),
			Name: todo.User.Name,
		},
	}

	return resTodo, nil
}

// UpdateTodo is the resolver for the updateTodo field.
func (r *mutationResolver) UpdateTodo(ctx context.Context, todoID string, text string) (*model.Todo, error) {
	tID, err := strconv.Atoi(todoID)
	if err != nil {
		return nil, err
	}
	todo := &entity.Todo{
		TodoID: tID,
		Text:   text,
	}

	err = r.tu.UpdateTodo(ctx, todo)
	if err != nil {
		return nil, err
	}

	resTodo := &model.Todo{
		ID:   strconv.Itoa(todo.TodoID),
		Text: todo.Text,
		Done: todo.Done,
		User: &model.User{
			ID:   strconv.Itoa(todo.User.UserID),
			Name: todo.User.Name,
		},
	}
	return resTodo, nil
}

// DeleteTodo is the resolver for the deleteTodo field.
func (r *mutationResolver) DeleteTodo(ctx context.Context, todoID string) (bool, error) {
	tID, err := strconv.Atoi(todoID)
	if err != nil {
		return false, err
	}

	err = r.tu.DeleteTodo(ctx, tID)
	if err != nil {
		return false, err
	}

	return true, nil
}

// Todos is the resolver for the todos field.
func (r *queryResolver) Todos(ctx context.Context) ([]*model.Todo, error) {
	userID, err := strconv.Atoi(ctx.Value("user_id").(string))
	if err != nil {
		return nil, err
	}

	todos, err := r.tu.GetAllTodos(ctx, userID)
	if err != nil {
		return nil, err
	}

	resTodos := []*model.Todo{}
	for _, todo := range todos {
		resTodos = append(resTodos, &model.Todo{
			ID:   strconv.Itoa(todo.TodoID),
			Text: todo.Text,
			Done: todo.Done,
			User: &model.User{
				ID:   strconv.Itoa(todo.User.UserID),
				Name: todo.User.Name,
			},
		})
	}

	return resTodos, nil
}
