package usecase

import (
	"context"
	"graphql-api/entity"
	"graphql-api/repository"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/pkg/errors"
	"golang.org/x/crypto/bcrypt"
)

type IUserUsecase interface {
	CreateUser(ctx context.Context, user *entity.User) error
	Login(ctx context.Context, user *entity.User) (string, error)
}

type userUsecase struct {
	ur repository.IUserRepository
}

func NewUserUsecase(ur repository.IUserRepository) IUserUsecase {
	return &userUsecase{ur}
}

func (uu *userUsecase) CreateUser(ctx context.Context, user *entity.User) error {

	userExists, err := uu.ur.CheckExistsUserByEmail(ctx, user.Email)
	if err != nil {
		return errors.WithStack(err)
	}

	if userExists {
		return errors.New("EMAIL_ALREADY_USED")
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(user.Password), 10)
	if err != nil {
		return errors.WithStack(err)
	}
	user.Password = string(hash)

	err = uu.ur.CreateUser(ctx, user)
	if err != nil {
		return errors.WithStack(err)
	}

	return nil
}

func createJwtTokenByUserID(userID int) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": userID,
		"exp":     time.Now().Add(time.Hour * 12).Unix(),
	})
	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))
	if err != nil {
		return "", errors.WithStack(err)
	}

	return tokenString, nil
}

func (uu *userUsecase) Login(ctx context.Context, user *entity.User) (string, error) {

	storedUser, err := uu.ur.GetUserByEmail(ctx, user.Email)
	if err != nil {
		return "", errors.WithStack(err)
	}

	err = bcrypt.CompareHashAndPassword([]byte(storedUser.Password), []byte(user.Password))
	if err != nil {
		return "", errors.WithStack(err)
	}

	user.UserID = storedUser.UserID
	user.Name = storedUser.Name

	tokenString, err := createJwtTokenByUserID(user.UserID)
	if err != nil {
		return "", errors.WithStack(err)
	}

	return tokenString, nil
}
