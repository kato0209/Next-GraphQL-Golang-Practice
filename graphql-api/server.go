package main

import (
	"graphql-api/db"
	"graphql-api/graph/generated"
	"graphql-api/graph/resolver"
	"graphql-api/repository"
	"graphql-api/usecase"
	"log"
	"net/http"
	"os"

	"github.com/99designs/gqlgen/graphql/handler"
	"github.com/99designs/gqlgen/graphql/playground"
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

	iRepository := repository.NewTodoRepository(db)
	iTodoUsecase := usecase.NewTodoUsecase(iRepository)
	resolver := resolver.NewResolver(&iTodoUsecase)
	srv := handler.NewDefaultServer(generated.NewExecutableSchema(generated.Config{Resolvers: resolver}))

	http.Handle("/", playground.Handler("GraphQL playground", "/query"))
	http.Handle("/query", srv)

	log.Printf("connect to http://localhost:%s/ for GraphQL playground", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}
