package store

import (
	"context"
	"time"

	"github.com/jackc/pgx/v5/pgxpool"
)

type User struct {
	ID        int64     `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Member struct {
	ID        int64     `json:"id"`
	FirstName string    `json:"first_name"`
	LastName  string    `json:"last_name"`
	UserID    int64     `json:"user_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Team struct {
	ID        int64     `json:"id"`
	Name      string    `json:"name"`
	ClientID  int64     `json:"client_id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type Client struct {
	ID        int64     `json:"id"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type SignupResult struct {
	User     User   `json:"user"`
	Member   Member `json:"member"`
	Team     Team   `json:"team"`
	Client   Client `json:"client"`
	TeamID   int64  `json:"team_id"`
	MemberID int64  `json:"member_id"`
}

const qCreateUser = `
INSERT INTO "user" (email, password)
VALUES ($1, $2)
RETURNING id, email, created_at, updated_at;`

const qGetUserByEmail = `
SELECT id, email, password, created_at, updated_at
FROM "user"
WHERE email = $1;`

const qCreateClient = `
INSERT INTO client DEFAULT VALUES
RETURNING id, created_at, updated_at;`

const qCreateMember = `
INSERT INTO member (first_name, last_name, user_id)
VALUES ($1, $2, $3)
RETURNING id, first_name, last_name, user_id, created_at, updated_at;`

const qCreateTeam = `
INSERT INTO team (name, client_id)
VALUES ($1, $2)
RETURNING id, name, client_id, created_at, updated_at;`

const qCreateTeamMember = `
INSERT INTO team_member (team_id, member_id, role)
VALUES ($1, $2, $3);`

const qGetUserWithTeamInfo = `
SELECT u.id, u.email, u.password, m.id as member_id, tm.team_id
FROM "user" u
JOIN member m ON u.id = m.user_id
JOIN team_member tm ON m.id = tm.member_id
WHERE u.email = $1
LIMIT 1;`

func CreateUser(ctx context.Context, db *pgxpool.Pool, email, hashedPassword string) (*User, error) {
	var user User
	err := db.QueryRow(ctx, qCreateUser, email, hashedPassword).Scan(
		&user.ID, &user.Email, &user.CreatedAt, &user.UpdatedAt,
	)
	return &user, err
}

func GetUserByEmail(ctx context.Context, db *pgxpool.Pool, email string) (*User, error) {
	var user User
	err := db.QueryRow(ctx, qGetUserByEmail, email).Scan(
		&user.ID, &user.Email, &user.Password, &user.CreatedAt, &user.UpdatedAt,
	)
	return &user, err
}

func GetUserWithTeamInfo(ctx context.Context, db *pgxpool.Pool, email string) (int64, string, string, int64, int64, error) {
	var userID, memberID, teamID int64
	var userEmail, password string
	err := db.QueryRow(ctx, qGetUserWithTeamInfo, email).Scan(
		&userID, &userEmail, &password, &memberID, &teamID,
	)
	return userID, userEmail, password, memberID, teamID, err
}

func SignupUser(ctx context.Context, db *pgxpool.Pool, email, hashedPassword, firstName, lastName string) (*SignupResult, error) {
	tx, err := db.Begin(ctx)
	if err != nil {
		return nil, err
	}
	defer tx.Rollback(ctx)

	var result SignupResult

	err = tx.QueryRow(ctx, qCreateUser, email, hashedPassword).Scan(
		&result.User.ID, &result.User.Email, &result.User.CreatedAt, &result.User.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	err = tx.QueryRow(ctx, qCreateClient).Scan(
		&result.Client.ID, &result.Client.CreatedAt, &result.Client.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	err = tx.QueryRow(ctx, qCreateMember, firstName, lastName, result.User.ID).Scan(
		&result.Member.ID, &result.Member.FirstName, &result.Member.LastName,
		&result.Member.UserID, &result.Member.CreatedAt, &result.Member.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	teamName := firstName + "'s Team"
	err = tx.QueryRow(ctx, qCreateTeam, teamName, result.Client.ID).Scan(
		&result.Team.ID, &result.Team.Name, &result.Team.ClientID,
		&result.Team.CreatedAt, &result.Team.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}

	_, err = tx.Exec(ctx, qCreateTeamMember, result.Team.ID, result.Member.ID, "admin")
	if err != nil {
		return nil, err
	}

	result.TeamID = result.Team.ID
	result.MemberID = result.Member.ID

	return &result, tx.Commit(ctx)
} 