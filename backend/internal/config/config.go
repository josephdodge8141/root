package config

import "github.com/caarlos0/env/v11"

type Config struct {
	AppName     string `env:"APP_NAME"     envDefault:"root-by-grove"`
	AppEnv      string `env:"APP_ENV"      envDefault:"dev"`
	AppVersion  string `env:"APP_VERSION"  envDefault:"0.1.0"`
	HTTPAddr    string `env:"HTTP_ADDR"    envDefault:":8080"`
	DatabaseURL string `env:"DATABASE_URL" envDefault:"postgres://root:root@localhost:5432/root?sslmode=disable"`
}

func Load() (Config, error) {
	var c Config
	return c, env.Parse(&c)
} 