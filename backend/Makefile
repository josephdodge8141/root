APP_NAME=root-api
PKG=github.com/yourorg/root-api

.PHONY: run build test tidy
run:
	HTTP_ADDR=:8080 go run ./cmd/api

build:
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o bin/api ./cmd/api

test:
	go test ./...

tidy:
	go mod tidy 