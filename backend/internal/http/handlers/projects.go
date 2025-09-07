package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"root-api/internal/http/middleware"
	"root-api/internal/store"
)

type ProjectHandlers struct {
	db     *pgxpool.Pool
	logger *zap.Logger
}

func NewProjectHandlers(db *pgxpool.Pool, logger *zap.Logger) *ProjectHandlers {
	return &ProjectHandlers{
		db:     db,
		logger: logger,
	}
}

type ProjectWithDetails struct {
	Project   store.Project `json:"project"`
	Nodes     []store.Node  `json:"nodes"`
	Edges     []store.Edge  `json:"edges"`
	Artifacts []store.ArtifactWithNodes `json:"artifacts"`
}

func (h *ProjectHandlers) ListProjects(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	teamIDParam := r.URL.Query().Get("team_id")
	memberIDParam := r.URL.Query().Get("member_id")

	var teamID, memberID *int64

	if teamIDParam != "" {
		if tid, err := strconv.ParseInt(teamIDParam, 10, 64); err == nil {
			teamID = &tid
		}
	} else {
		teamID = &claims.TeamID
	}

	if memberIDParam != "" {
		if mid, err := strconv.ParseInt(memberIDParam, 10, 64); err == nil {
			memberID = &mid
		}
	}

	projects, err := store.ListProjectsFiltered(r.Context(), h.db, teamID, memberID)
	if err != nil {
		h.logger.Error("Failed to list projects", zap.Error(err))
		http.Error(w, "Failed to list projects", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(projects)
}

func (h *ProjectHandlers) GetProject(w http.ResponseWriter, r *http.Request) {
	claims, ok := middleware.GetUserFromContext(r.Context())
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	projectIDStr := chi.URLParam(r, "id")
	projectID, err := strconv.ParseInt(projectIDStr, 10, 64)
	if err != nil {
		http.Error(w, "Invalid project ID", http.StatusBadRequest)
		return
	}

	project, err := store.GetProjectByID(r.Context(), h.db, projectID)
	if err != nil {
		h.logger.Error("Failed to get project", zap.Error(err))
		http.Error(w, "Project not found", http.StatusNotFound)
		return
	}

	if project.TeamID != nil && *project.TeamID != claims.TeamID {
		http.Error(w, "Access denied", http.StatusForbidden)
		return
	}

	nodes, err := store.ListNodesByProject(r.Context(), h.db, projectID)
	if err != nil {
		h.logger.Error("Failed to get project nodes", zap.Error(err))
		http.Error(w, "Failed to get project details", http.StatusInternalServerError)
		return
	}

	edges, err := store.ListEdgesByProject(r.Context(), h.db, projectID)
	if err != nil {
		h.logger.Error("Failed to get project edges", zap.Error(err))
		http.Error(w, "Failed to get project details", http.StatusInternalServerError)
		return
	}

	artifacts, err := store.ListArtifactsByProject(r.Context(), h.db, projectID)
	if err != nil {
		h.logger.Error("Failed to get project artifacts", zap.Error(err))
		http.Error(w, "Failed to get project details", http.StatusInternalServerError)
		return
	}

	result := ProjectWithDetails{
		Project:   *project,
		Nodes:     nodes,
		Edges:     edges,
		Artifacts: artifacts,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(result)
} 