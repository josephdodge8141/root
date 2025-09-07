package store

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

type Project struct {
	ID       int64
	Name     string
	TeamID   *int64
	MemberID *int64
}

const qCreateProject = `
INSERT INTO project (name, team_id, member_id)
VALUES ($1, $2, $3)
RETURNING id;`

const qListProjectsByTeam = `
SELECT id, name, team_id, member_id
FROM project
WHERE ($1::bigint IS NULL OR team_id = $1)
ORDER BY id DESC;`

func CreateProject(ctx context.Context, db *pgxpool.Pool, name string, teamID, memberID *int64) (int64, error) {
	var id int64
	err := db.QueryRow(ctx, qCreateProject, name, teamID, memberID).Scan(&id)
	return id, err
}

func ListProjects(ctx context.Context, db *pgxpool.Pool, teamID *int64) ([]Project, error) {
	rows, err := db.Query(ctx, qListProjectsByTeam, teamID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		err := rows.Scan(&p.ID, &p.Name, &p.TeamID, &p.MemberID)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, rows.Err()
}

const qListProjectsFiltered = `
SELECT id, name, team_id, member_id
FROM project
WHERE ($1::bigint IS NULL OR team_id = $1)
  AND ($2::bigint IS NULL OR member_id = $2)
ORDER BY id DESC;`

const qGetProjectByID = `
SELECT id, name, team_id, member_id
FROM project
WHERE id = $1;`

func ListProjectsFiltered(ctx context.Context, db *pgxpool.Pool, teamID, memberID *int64) ([]Project, error) {
	rows, err := db.Query(ctx, qListProjectsFiltered, teamID, memberID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var projects []Project
	for rows.Next() {
		var p Project
		err := rows.Scan(&p.ID, &p.Name, &p.TeamID, &p.MemberID)
		if err != nil {
			return nil, err
		}
		projects = append(projects, p)
	}
	return projects, rows.Err()
}

func GetProjectByID(ctx context.Context, db *pgxpool.Pool, projectID int64) (*Project, error) {
	var p Project
	err := db.QueryRow(ctx, qGetProjectByID, projectID).Scan(&p.ID, &p.Name, &p.TeamID, &p.MemberID)
	return &p, err
} 