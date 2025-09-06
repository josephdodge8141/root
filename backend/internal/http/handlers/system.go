package handlers

import (
	"encoding/json"
	"net/http"
)

type HealthResponse struct{ Status string `json:"status"` }
type VersionResponse struct{ Version string `json:"version"` }

func Health(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	_ = json.NewEncoder(w).Encode(HealthResponse{Status: "ok"})
}

func Version(appVersion string) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		_ = json.NewEncoder(w).Encode(VersionResponse{Version: appVersion})
	}
} 