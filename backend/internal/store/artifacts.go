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

type ArtifactWithNodes struct {
	ID            int64   `json:"id"`
	Name          string  `json:"name"`
	BaseURLID     int64   `json:"base_url_id"`
	URLIdentifier string  `json:"url_identifier"`
	NodeIDs       []int64 `json:"node_ids"`
}

const qListArtifactsByProject = `
SELECT DISTINCT a.id, a.name, a.base_url_id, a.url_identifier
FROM artifact a
JOIN node_artifact na ON a.id = na.artifact_id
JOIN node n ON na.node_id = n.id
WHERE n.project_id = $1;`

const qGetNodeIDsForArtifact = `
SELECT na.node_id
FROM node_artifact na
JOIN node n ON na.node_id = n.id
WHERE na.artifact_id = $1 AND n.project_id = $2;`

func ListArtifactsByProject(ctx context.Context, db *pgxpool.Pool, projectID int64) ([]ArtifactWithNodes, error) {
	rows, err := db.Query(ctx, qListArtifactsByProject, projectID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var artifacts []ArtifactWithNodes
	for rows.Next() {
		var a ArtifactWithNodes
		err := rows.Scan(&a.ID, &a.Name, &a.BaseURLID, &a.URLIdentifier)
		if err != nil {
			return nil, err
		}

		nodeRows, err := db.Query(ctx, qGetNodeIDsForArtifact, a.ID, projectID)
		if err != nil {
			return nil, err
		}

		var nodeIDs []int64
		for nodeRows.Next() {
			var nodeID int64
			if err := nodeRows.Scan(&nodeID); err != nil {
				nodeRows.Close()
				return nil, err
			}
			nodeIDs = append(nodeIDs, nodeID)
		}
		nodeRows.Close()

		a.NodeIDs = nodeIDs
		artifacts = append(artifacts, a)
	}
	return artifacts, rows.Err()
} 