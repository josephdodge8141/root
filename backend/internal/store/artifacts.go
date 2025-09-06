package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

const qCreateArtifact = `
INSERT INTO artifact (name, base_url_id, url_identifier)
VALUES ($1, $2, $3)
RETURNING id;`

const qLinkNodeArtifact = `
INSERT INTO node_artifact (node_id, artifact_id)
VALUES ($1, $2)
ON CONFLICT (node_id, artifact_id) DO NOTHING;`

func CreateArtifact(ctx context.Context, db *pgxpool.Pool, name string, baseURLID int64, urlIdentifier string) (int64, error) {
	var id int64
	err := db.QueryRow(ctx, qCreateArtifact, name, baseURLID, urlIdentifier).Scan(&id)
	return id, err
}

func LinkNodeArtifact(ctx context.Context, db *pgxpool.Pool, nodeID, artifactID int64) error {
	_, err := db.Exec(ctx, qLinkNodeArtifact, nodeID, artifactID)
	return err
} 