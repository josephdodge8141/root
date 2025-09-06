package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Node struct {
	ID          int64
	ProjectID   *int64
	Type        string
	Label       string
	Description string
	Metadata    []byte
}

const qCreateNode = `
INSERT INTO node (metadata, project_id, type, label, description)
VALUES ($1, $2, $3, $4, $5)
RETURNING id;`

const qListNodes = `
SELECT id, project_id, type, label, description, metadata
FROM node
WHERE project_id = $1;`

func CreateNode(ctx context.Context, db *pgxpool.Pool, n Node) (int64, error) {
	var id int64
	err := db.QueryRow(ctx, qCreateNode, n.Metadata, n.ProjectID, n.Type, n.Label, n.Description).Scan(&id)
	return id, err
}

func ListNodesByProject(ctx context.Context, db *pgxpool.Pool, projectID int64) ([]Node, error) {
	rows, err := db.Query(ctx, qListNodes, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var nodes []Node
	for rows.Next() {
		var n Node
		err := rows.Scan(&n.ID, &n.ProjectID, &n.Type, &n.Label, &n.Description, &n.Metadata)
		if err != nil {
			return nil, err
		}
		nodes = append(nodes, n)
	}
	return nodes, rows.Err()
} 