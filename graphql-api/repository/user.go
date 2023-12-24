package repository

import (
	"graphql-api/entity"

	"github.com/jmoiron/sqlx"
	"github.com/pkg/errors"
)

type IUserRepository interface {
	GetUserByID(userID int) (entity.User, error)
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
