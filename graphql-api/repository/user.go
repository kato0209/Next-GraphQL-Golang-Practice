package repository

import (
	"context"
	"graphql-api/entity"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type IUserRepository interface {
	GetUserByID(userID int) (entity.User, error)
	CreateUser(ctx context.Context, user *entity.User) error
	CheckExistsUserByEmail(ctx context.Context, email string) (bool, error)
	GetUserByEmail(ctx context.Context, email string) (entity.User, error)
}

type userRepository struct {
	db *sqlx.DB
}

func NewUserRepository(db *sqlx.DB) IUserRepository {
	return &userRepository{db}
}

func (ur *userRepository) GetUserByID(userID int) (entity.User, error) {
	var user entity.User
	query := `SELECT user_id, name FROM users WHERE user_id = $1`
	err := ur.db.Get(&user, query, userID)
	if err != nil {
		return user, errors.WithStack(err)
	}
	return user, nil
}

func (ur *userRepository) CreateUser(ctx context.Context, user *entity.User) error {
	query := `INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING user_id`
	err := ur.db.QueryRow(query, user.Name, user.Email, user.Password).Scan(&user.UserID)
	if err != nil {
		return errors.WithStack(err)
	}
	return nil
}

func (ur *userRepository) CheckExistsUserByEmail(ctx context.Context, email string) (bool, error) {
	var exists bool
	query := `SELECT EXISTS(SELECT 1 FROM users WHERE email = $1)`
	err := ur.db.Get(&exists, query, email)
	if err != nil {
		return false, errors.WithStack(err)
	}
	return exists, nil
}

func (ur *userRepository) GetUserByEmail(ctx context.Context, email string) (entity.User, error) {
	var user entity.User
	query := `SELECT user_id, name, email, password FROM users WHERE email = $1`
	err := ur.db.Get(&user, query, email)
	if err != nil {
		return user, errors.WithStack(err)
	}
	return user, nil
}
