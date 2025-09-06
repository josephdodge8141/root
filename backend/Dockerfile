# ---- build stage
FROM golang:1.25.1-alpine AS builder
WORKDIR /src
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o /out/api ./cmd/api

# ---- runtime stage (distroless)
FROM gcr.io/distroless/static-debian12
WORKDIR /
COPY --from=builder /out/api /api
COPY --from=builder /src/migrations /migrations
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/api"]
