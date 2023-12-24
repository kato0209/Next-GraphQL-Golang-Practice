FROM golang:1.21.1 as development
WORKDIR /graphql-api
COPY go.mod go.sum ./
RUN go mod download

RUN go install github.com/cosmtrek/air@v1.42.0
ENTRYPOINT ["air"]