package main

import (
	"graphql-api/db"
	"graphql-api/graph/generated"
	"graphql-api/graph/resolver"
	"graphql-api/middleware"
	"graphql-api/repository"
	"graphql-api/usecase"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
	_ "github.com/lib/pq"
	"github.com/rs/cors"
	"golang.org/x/exp/slog"
)

const defaultPort = "8080"

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = defaultPort
	}

	db, err := db.Open()
	if err != nil {
		slog.Error("db connection error", "error", err)
	}
	defer db.Close()

	iTodoRepository := repository.NewTodoRepository(db)
	iUserRepository := repository.NewUserRepository(db)
	iTodoUsecase := usecase.NewTodoUsecase(iTodoRepository, iUserRepository)
	iUserUsecase := usecase.NewUserUsecase(iUserRepository)
	resolver := resolver.NewResolver(iTodoUsecase, iUserUsecase)

	directive := generated.DirectiveRoot{IsAuthenticated: middleware.Authorize}
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{
		Resolvers:  resolver,
		Directives: directive,
	},
	))

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowCredentials: true,
	})
	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", c.Handler(middleware.CookieMiddleWare(srv)))

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
