package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Edge struct {
	NodeAID          int64
	NodeBID          int64
	RelationshipType string
}

const qUpsertEdge = `
INSERT INTO edge (node_a_id, node_b_id, relationship_type)
VALUES ($1, $2, $3)
ON CONFLICT (node_a_id, node_b_id, relationship_type) DO NOTHING;`

const qListEdgesByProject = `
SELECT e.node_a_id, e.node_b_id, e.relationship_type
FROM edge e
JOIN node na ON na.id = e.node_a_id
JOIN node nb ON nb.id = e.node_b_id
WHERE na.project_id = $1 AND nb.project_id = $1;`

func UpsertEdge(ctx context.Context, db *pgxpool.Pool, e Edge) error {
	_, err := db.Exec(ctx, qUpsertEdge, e.NodeAID, e.NodeBID, e.RelationshipType)
	return err
}

func ListEdgesByProject(ctx context.Context, db *pgxpool.Pool, projectID int64) ([]Edge, error) {
	rows, err := db.Query(ctx, qListEdgesByProject, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var edges []Edge
	for rows.Next() {
		var e Edge
		err := rows.Scan(&e.NodeAID, &e.NodeBID, &e.RelationshipType)
		if err != nil {
			return nil, err
		}
		edges = append(edges, e)
	}
	return edges, rows.Err()
} 