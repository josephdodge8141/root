package main

import (
	"context"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"go.uber.org/zap"

	"github.com/yourorg/root-api/internal/config"
	"github.com/yourorg/root-api/internal/db"
	"github.com/yourorg/root-api/internal/http/handlers"
	"github.com/yourorg/root-api/internal/logging"
)

func main() {
	cfg, err := config.Load()
	if err != nil {
		panic(err)
	}

	log, err := logging.New()
	if err != nil {
		panic(err)
	}
	defer log.Sync()

	ctx := context.Background()
	dsn := db.MustEnv("DATABASE_URL")
	pool, err := db.Open(ctx, dsn)
	if err != nil {
		log.Fatal("db.open", zap.String("err", err.Error()))
	}
	defer pool.Close()

	if err := db.Migrate(ctx, pool, "migrations"); err != nil {
		log.Fatal("db.migrate", zap.String("err", err.Error()))
	}

	r := chi.NewRouter()
	r.Use(middleware.RequestID, middleware.RealIP, middleware.Recoverer, middleware.Timeout(60*time.Second))

	r.Route("/api/v1", func(api chi.Router) {
		api.Get("/health", handlers.Health)
		api.Get("/version", handlers.Version(cfg.AppVersion))
	})

	srv := &http.Server{Addr: cfg.HTTPAddr, Handler: r}

	go func() {
		log.Info("server.start", zapField("addr", cfg.HTTPAddr), zapField("env", cfg.AppEnv))
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal("server.error", zapField("err", err.Error()))
		}
	}()

	stop := make(chan os.Signal, 1)
	signal.Notify(stop, os.Interrupt, syscall.SIGTERM)
	<-stop
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()
	_ = srv.Shutdown(ctx)
	log.Info("server.stopped")
}

func zapField(k string, v interface{}) zap.Field { return zap.Any(k, v) } 