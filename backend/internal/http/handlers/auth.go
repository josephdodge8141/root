package handlers

import (
	"encoding/json"
	"net/http"

	"github.com/jackc/pgx/v5/pgxpool"
	"go.uber.org/zap"

	"root-api/internal/auth"
	"root-api/internal/store"
)

type AuthHandlers struct {
	db          *pgxpool.Pool
	authService *auth.Service
	logger      *zap.Logger
}

func NewAuthHandlers(db *pgxpool.Pool, authService *auth.Service, logger *zap.Logger) *AuthHandlers {
	return &AuthHandlers{
		db:          db,
		authService: authService,
		logger:      logger,
	}
}

type SignupRequest struct {
	Email     string `json:"email"`
	Password  string `json:"password"`
	FirstName string `json:"first_name"`
	LastName  string `json:"last_name"`
}

type SigninRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type AuthResponse struct {
	Token string            `json:"token"`
	User  *store.SignupResult `json:"user,omitempty"`
}

func (h *AuthHandlers) Signup(w http.ResponseWriter, r *http.Request) {
	var req SignupRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" || req.FirstName == "" || req.LastName == "" {
		http.Error(w, "All fields are required", http.StatusBadRequest)
		return
	}

	hashedPassword, err := h.authService.HashPassword(req.Password)
	if err != nil {
		h.logger.Error("Failed to hash password", zap.Error(err))
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	result, err := store.SignupUser(r.Context(), h.db, req.Email, hashedPassword, req.FirstName, req.LastName)
	if err != nil {
		h.logger.Error("Failed to create user", zap.Error(err))
		http.Error(w, "Failed to create user", http.StatusInternalServerError)
		return
	}

	token, err := h.authService.GenerateToken(result.User.ID, result.User.Email, result.MemberID, result.TeamID)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := AuthResponse{
		Token: token,
		User:  result,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *AuthHandlers) Signin(w http.ResponseWriter, r *http.Request) {
	var req SigninRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	if req.Email == "" || req.Password == "" {
		http.Error(w, "Email and password are required", http.StatusBadRequest)
		return
	}

	userID, email, hashedPassword, memberID, teamID, err := store.GetUserWithTeamInfo(r.Context(), h.db, req.Email)
	if err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	if err := h.authService.CheckPassword(hashedPassword, req.Password); err != nil {
		http.Error(w, "Invalid credentials", http.StatusUnauthorized)
		return
	}

	token, err := h.authService.GenerateToken(userID, email, memberID, teamID)
	if err != nil {
		h.logger.Error("Failed to generate token", zap.Error(err))
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	response := AuthResponse{
		Token: token,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
} 