package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

const qCreateProjectGraph = `
INSERT INTO project_graph (project_id, persona)
VALUES ($1, $2)
RETURNING id;`

func CreateProjectGraph(ctx context.Context, db *pgxpool.Pool, projectID int64, persona string) (int64, error) {
	var id int64
	err := db.QueryRow(ctx, qCreateProjectGraph, projectID, persona).Scan(&id)
	return id, err
} 