package middleware

import (
	"context"
	"fmt"
	"net/http"
)

type contextKey struct {
	uuid string
}

var httpWriterKey = &contextKey{"httpWriter"}
var jwtTokenKey = &contextKey{"jwtToken"}

// CookieMiddleWare
func CookieMiddleWare(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println(7877777777777)
		ctx := context.WithValue(r.Context(), httpWriterKey, w)
		cookie, err := r.Cookie("jwt_token")
		fmt.Println(cookie)
		if err == nil {
			ctx = context.WithValue(ctx, jwtTokenKey, cookie.Value)
		}
		r = r.WithContext(ctx)
		next.ServeHTTP(w, r)
	})
}

// RemoveAuthCookie called when user wants to log out, return an instantly expired cookie
func RemoveAuthCookie(ctx context.Context) {
	writer, _ := ctx.Value(httpWriterKey).(http.ResponseWriter)
	http.SetCookie(writer, &http.Cookie{
		HttpOnly: true,
		MaxAge:   0,
		Name:     "jwt_token",
	})
}

// SetAuthCookie can be used inside resolvers to set a cookie
func SetAuthCookie(ctx context.Context, sessionToken string) {
	writer, _ := ctx.Value(httpWriterKey).(http.ResponseWriter)
	day := 60 * 60 * 24 * 1

	http.SetCookie(writer, &http.Cookie{
		HttpOnly: true,
		MaxAge:   day,
		SameSite: http.SameSiteNoneMode,
		Name:     "jwt_token",
		Secure:   true,
		Value:    sessionToken,
	})
}
