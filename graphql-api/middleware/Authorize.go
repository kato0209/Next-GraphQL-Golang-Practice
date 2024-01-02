package middleware

import (
	"context"
	"errors"
	"fmt"
	"os"
	"strconv"

	"github.com/99designs/gqlgen/graphql"
	"github.com/golang-jwt/jwt/v4"
)

func decodeJWT(tokenString string) (*jwt.MapClaims, error) {
	token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("Unexpected signing method: %v", token.Header["alg"])
		}

		return []byte(os.Getenv("JWT_SECRET")), nil
	})
	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return &claims, nil
	} else {
		return nil, fmt.Errorf("Invalid token")
	}
}

func Authorize(ctx context.Context, obj interface{}, next graphql.Resolver) (interface{}, error) {
	jwtToken, ok := ctx.Value(jwtTokenKey).(string)
	if !ok {
		return nil, errors.New(fmt.Sprintf("failed to authorize"))
	}

	claims, err := decodeJWT(jwtToken)
	if err != nil {
		return nil, err
	}

	userID, ok := (*claims)["user_id"].(float64)
	if !ok {
		return "", fmt.Errorf("User ID not found in token")
	}
	ctx = context.WithValue(ctx, "user_id", strconv.Itoa(int(userID)))

	return next(ctx)
}
