# Root API

## Prerequisites

- Go 1.25.1
- Docker

## Run locally

```bash
make run
```

## Build & run container

```bash
docker build -t root-api:dev .
docker run -p 8080:8080 root-api:dev
```

## Endpoints

- `GET /api/v1/health`
- `GET /api/v1/version` 